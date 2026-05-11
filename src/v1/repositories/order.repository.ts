import prisma from "@/helpers/prisma.helper";
import { Order } from "@/interfaces/types/order.types";
import { Prisma } from "@prisma/client";

/**
 * Get Orders
 * @param bookingId
 * @returns list of orders
 */
export const getOrders = async (
    hotelId: number,
    bookingId: number | null,
    status: string,
    skip: number,
    limit: number
) => {
    const where: Prisma.OrderWhereInput = {
        hotel_id: hotelId,
        order_items: {
            some: {
                product: {
                    hotel_id: hotelId,
                },
            },
        },
    };

    if (bookingId) {
        where.booking_id = bookingId;
    }

    if (status) {
        where.status = { contains: status, mode: "insensitive" };
    }

    const orders = await prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ id: "desc" }],
        include: {
            order_items: {
                include: {
                    product: {
                        include: {
                            inventory: true,
                        },
                    },
                },
            },
            booking: {
                include: {
                    room: true,
                },
            },
        },
    });

    return orders.map((order) => ({
        ...order,
        item_count: order.order_items.length,
        total_price: order.order_items.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
        ),
    }));
};

export const countOrders = async (hotelId: number, bookingId: number | null, status: string) => {
    const where: Prisma.OrderWhereInput = {
        hotel_id: hotelId,
    };

    if (bookingId) {
        where.booking_id = bookingId;
    }

    if (status) {
        where.status = { contains: status, mode: "insensitive" };
    }

    return await prisma.order.count({
        where
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
        include: {
            order_items: {
                include: {
                    product: {
                        include: {
                            inventory: true,
                        },
                    },
                },
            },
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
        data: {
            hotel_id: data.hotel_id!,
            booking_id: data.booking_id,
            status: data.status,
            total_price: data.total_price,
            notes: data.notes,
        },
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
        data: {
            hotel_id: data.hotel_id!,
            booking_id: data.booking_id,
            status: data.status,
            total_price: data.total_price,
            notes: data.notes,
        },
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