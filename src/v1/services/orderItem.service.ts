import { NotFoundError } from "@/helpers/error.helper";

import * as OrderItemRepository from "@/repositories/orderItem.repository";
import { getInventoryByProductId, updateInventory } from "@/repositories/inventory.repository";
import { createOrder } from "./order.service";
import { OrderItem } from "@/interfaces/types/orderItem.types";

/**
 * Gets all Order Items
 * @param orderId
 * @returns
 */
export const getOrderItems = async (orderId: number) => {
    return await OrderItemRepository.getOrderItems(orderId);
};

/**
 * Create Order Item service
 * @param data
 * @returns created Order Item
 */
export const createOrderItem = async (data: OrderItem, hotelId: number, bookingId: number, userId: number) => {
    console.log('createOrderItem data', data)

    let orderId = data.order_id;
    if (orderId === 0) {
        const order = await createOrder(
            hotelId,
            userId,
            {
                hotel_id: hotelId,
                booking_id: bookingId,
                total_price: 0,
                status: "completed",
            });

        orderId = order.id;
    }

    return await OrderItemRepository.createOrderItem({
        ...data,
        order_id: orderId,
        user_id: userId,
        transferred_from_booking_id: data.transferred_from_booking_id || null,
    });
};

/**
 * Deletes Order Item
 * @param orderItemId
 */
export const deleteOrderItem = async (hotelId: number, orderItemId: number) => {
    const orderItem = await OrderItemRepository.getOrderItemById(orderItemId);
    if (orderItem) {

        const inventory = await getInventoryByProductId(hotelId, orderItem.product_id);

        if (inventory) {
            await updateInventory(hotelId, inventory.id, {
                reserved_qty: inventory.reserved_qty - orderItem.quantity
            });
        }

        return await OrderItemRepository.deleteOrderItem(orderItemId);
    } else {
        throw new NotFoundError("Order item not found");
    }
};