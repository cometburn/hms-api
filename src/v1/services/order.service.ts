import { NotFoundError } from "@/helpers/error.helper";
import prisma from "@/helpers/prisma.helper";
import { Order, OrderRequestParams, DirectOrder } from "@/interfaces/types/order.types";
import * as OrderRepository from "@/repositories/order.repository";
import * as OrderItemRepository from "@/repositories/orderItem.repository";
import * as InventoryRepository from "@/repositories/inventory.repository";
import { createProductMovement, updateProductMovementByBookingId, updateProductMovementByOrderIdAndOrderItemId } from "@/repositories/productMovement.repository";
import { updateProductMovement } from "@/repositories/productMovement.repository";

/**
 * Get Orders
 * @param bookingId
 * @returns
 */
export const getOrders = async ({
    hotelId,
    bookingId,
    status,
    page,
    limit,
}: OrderRequestParams) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        OrderRepository.getOrders(hotelId, bookingId, status, skip, limit),
        OrderRepository.countOrders(hotelId, bookingId, status),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages,
        },
    };
};

/**
 * Get Order
 * @param bookingId
 * @returns
 */
export const getOrder = async (bookingId: number) => {
    return await OrderRepository.getOrder(bookingId);
};

/**
 * Create Order 
 * @param data
 * @returns created Order
 */
export const createOrder = async (hotelId: number, userId: number, data: Order) => {
    return prisma.$transaction(async (tx) => {
        const { order_items, ...orderData } = data;

        const order = await OrderRepository.createOrder({ ...orderData, hotel_id: hotelId });

        if (order_items && order_items.length > 0) {
            for (const { product, ...item } of order_items) {
                const createdOrderItem = await OrderItemRepository.createOrderItem({
                    ...item,
                    order_id: order.id,
                    user_id: userId,
                });

                await InventoryRepository.decrementStock(item.product_id, item.quantity);

                await createProductMovement({
                    user_id: userId,
                    product_id: item.product_id,
                    type: 'order',
                    quantity: item.quantity,
                    unit_cost: item.price,
                    booking_id: orderData.booking_id,
                    order_id: order.id,
                    order_item_id: createdOrderItem.id,
                    note: item.notes,
                });
            }
        }

        return order;
    });
};

/**
 * Update Order 
 * @param data
 * @returns updated Order
 */
export const updateOrder = async (hotelId: number, userId: number, data: Partial<Order>) => {
    return prisma.$transaction(async (tx) => {
        const { id, order_items, ...orderData } = data;

        if (!id) throw new NotFoundError("Order not found");

        const order = await OrderRepository.updateOrder(hotelId, id, { ...orderData, hotel_id: hotelId });

        if (order_items) {
            // Get existing items from DB
            const existingItems = await OrderItemRepository.getOrderItems(id);
            const existingIds = existingItems.map(i => i.id);

            for (const item of order_items) {
                if (item.id && existingIds.includes(item.id)) {
                    // adjust order item
                    await OrderItemRepository.updateOrderItem(item.id, {
                        quantity: item.quantity,
                        price: item.price,
                        total_price: item.quantity * item.price,
                    });

                    // adjust inventory
                    const existingItem = existingItems.find(i => i.id === item.id);
                    if (existingItem) {
                        const diff = item.quantity - existingItem.quantity;
                        console.log('item.quantity', item.quantity)
                        console.log('existingItem.quantity', existingItem.quantity)
                        console.log('diff', diff)
                        if (diff > 0) {
                            await InventoryRepository.decrementStock(item.product_id, diff);
                        } else if (diff < 0) {
                            await InventoryRepository.incrementStock(item.product_id, Math.abs(diff));
                        }

                        await updateProductMovementByOrderIdAndOrderItemId(hotelId, order.id, item.id, userId, {
                            quantity: item.quantity,
                            unit_cost: item.price,
                            booking_id: orderData.booking_id,
                            order_id: order.id,
                            order_item_id: item.id,
                            note: item.notes,
                        });

                    } else {
                        // create order item
                        const createdOrderItem = await OrderItemRepository.createOrderItem({
                            ...item,
                            order_id: order.id,
                            user_id: userId,
                        });

                        // add inventory entry
                        await InventoryRepository.decrementStock(item.product_id, item.quantity);

                        await createProductMovement({
                            user_id: userId,
                            product_id: item.product_id,
                            type: 'order',
                            quantity: item.quantity,
                            unit_cost: item.price,
                            booking_id: orderData.booking_id,
                            order_id: order.id,
                            order_item_id: createdOrderItem.id,
                            note: item.notes,
                        });
                    }
                }

            }

            return order;
        }
    });
};


/**
 * Deletes Order
 * @param bookingId
 */
export const deleteOrder = async (bookingId: number) => {
    return await OrderRepository.deleteOrder(bookingId);
};