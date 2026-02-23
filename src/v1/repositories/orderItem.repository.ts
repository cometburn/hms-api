import prisma from "@/helpers/prisma.helper";
import { OrderItem } from "@prisma/client";

/**
 * Get Order Items
 * @param hotelId
 * @param search
 * @param skip
 * @param limit
 * @returns list of orders
 */
export const getOrderItemsRepository = async (orderId: number) => {
    return await prisma.orderItem.findMany({
        where: {
            order_id: orderId,
        },
    });
};


/**
 * Create Order Item service
 * @param data
 * @returns created Order Item
 */
export const createOrderItemRepository = async (data: OrderItem) => {
    return await prisma.orderItem.create({
        data, include: {
            product: true
        }
    });
};

/**
 * Delete Order Item
 * @param id
 */
export const deleteOrderItemRepository = async (
    id: number
) => {
    return await prisma.orderItem.delete({
        where: {
            id,
        },
    });
};