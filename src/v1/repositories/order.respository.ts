import prisma from "@/helpers/prisma.helper";
import { Order } from "@/interfaces/types/order.types";


/**
 * Get Orders
 * @param bookingId
 * @returns list of orders
 */
export const getOrdersRepository = async (bookingId: number) => {
    return await prisma.order.findMany({
        where: {
            booking_id: bookingId,
        },
    });
};


/**
 * Create Order service
 * @param data
 * @returns created Order
 */
export const createOrderRepository = async (data: Order) => {
    return await prisma.order.create({
        data
    });
};

/**
 * Delete Order
 * @param id
 */
export const deleteOrderRepository = async (
    id: number
) => {
    return await prisma.order.delete({
        where: {
            id,
        },
    });
};