import prisma from "@/helpers/prisma.helper";
import { Order } from "@/interfaces/types/order.types";

/**
 * Get Orders
 * @param bookingId
 * @returns list of orders
 */
export const getOrders = async (
    hotelId: number,
    bookingId: number,
    status: string,
    skip: number,
    limit: number
) => {
    return await prisma.order.findMany({
        skip,
        take: limit,
        orderBy: [
            { id: "desc" },
        ],
        where: {
            booking_id: bookingId,
            ...(status && { status: { contains: status, mode: "insensitive" } }),
        },
        include: {
            booking: true,
        },
    });
};

export const countOrders = async (hotelId: number, bookingId: number, status: string) => {
    return await prisma.order.count({
        where: {
            booking_id: bookingId,
            ...(status && { status: { contains: status, mode: "insensitive" } }),
        },
    });
};

/**
 * Get Order
 * @param bookingId
 * @returns order
 */
export const getOrder = async (bookingId: number) => {
    return await prisma.order.findUnique({
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
export const createOrder = async (data: Order) => {
    return await prisma.order.create({
        data,
    });
};

/**
 * Update Order
 * @param id
 */
export const updateOrder = async (hotelId: number, orderId: number, data: Partial<Order>) => {
    return await prisma.order.update({
        where: {
            id: orderId,
            hotel_id: hotelId,
        },
        data,
    });
};

/**
 * Delete Order
 * @param id
 */
export const deleteOrder = async (id: number) => {
    return await prisma.order.delete({
        where: {
            id,
        },
    });
};