import { Order, OrderRequestParams } from "@/interfaces/types/order.types";
import * as OrderRepository from "@/repositories/order.repository";

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
export const createOrder = async (data: Order) => {
    return await OrderRepository.createOrder(data);
};

/**
 * Update Order 
 * @param data
 * @returns updated Order
 */
export const updateOrder = async (hotelId: number, orderId: number, data: Partial<Order>) => {
    return await OrderRepository.updateOrder(hotelId, orderId, data);
};


/**
 * Deletes Order
 * @param bookingId
 */
export const deleteOrder = async (bookingId: number) => {
    return await OrderRepository.deleteOrder(bookingId);
};