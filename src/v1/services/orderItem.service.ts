import { OrderItem } from "@prisma/client";
import {
    getOrderItemsRepository,
    createOrderItemRepository,
    deleteOrderItemRepository
} from "@/repositories/orderItem.repository";
import { OrderItemRequestParams } from "@/interfaces/types/orderItem.types";

/**
 * Gets all Order Items
 * @param orderId
 * @returns
 */
export const getOrderItemService = async ({ orderId }: OrderItemRequestParams) => {
    return await getOrderItemsRepository(orderId);
};


/**
 * Create Order Item service
 * @param data
 * @returns created Order Item
 */
export const createOrderItemService = async (data: OrderItem) => {
    return await createOrderItemRepository(data);
};

/**
 * Deletes Order Item
 * @param orderItemId
 */
export const deleteOrderItemService = async (
    orderItemId: number
) => {
    return await deleteOrderItemRepository(orderItemId);
};
