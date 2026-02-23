
import {
    getOrdersRepository,
    createOrderRepository,
    deleteOrderRepository
} from "@/repositories/order.respository";
import { Order, OrderRequestParams } from "@/interfaces/types/order.types";

/**
 * Gets all Orders
 * @param bookingId
 * @returns
 */
export const getOrderService = async ({ bookingId }: OrderRequestParams) => {
    return await getOrdersRepository(bookingId);
};


/**
 * Create Order service
 * @param data
 * @returns created Order
 */
export const createOrderService = async (data: Order) => {

    return await createOrderRepository(data);
};

/**
 * Deletes Order
 * @param bookingId
 */
export const deleteOrderService = async (
    bookingId: number
) => {
    return await deleteOrderRepository(bookingId);
};
