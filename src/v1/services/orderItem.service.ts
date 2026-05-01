import { OrderItem } from "@prisma/client";
import * as OrderItemRepository from "@/repositories/orderItem.repository";
import { getInventoryByProductId, updateInventory } from "@/repositories/inventory.repository";
import { NotFoundError } from "@/helpers/error.helper";

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
export const createOrderItem = async (data: OrderItem) => {
    return await OrderItemRepository.createOrderItem(data);
};

/**
 * Deletes Order Item
 * @param orderItemId
 */
export const deleteOrderItem = async (hotelId: number, orderItemId: number) => {
    const orderItem = await OrderItemRepository.getOrderItemById(orderItemId);
    if (orderItem) {

        const inventory = await getInventoryByProductId(hotelId, orderItem.product_id);

        if (!inventory) throw new NotFoundError("Inventory not found");

        await updateInventory(hotelId, inventory.id, {
            reserved_qty: inventory.reserved_qty - orderItem.quantity
        });

        return await OrderItemRepository.deleteOrderItem(orderItemId);
    } else {
        throw new NotFoundError("Order item not found");
    }
};