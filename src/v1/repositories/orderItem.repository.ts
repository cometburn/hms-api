import prisma from "@/helpers/prisma.helper";
import { Prisma } from "@prisma/client";
import { OrderItem } from "@/interfaces/types/orderItem.types";

/**
 * Get Order Items
 * @param hotelId
 * @param search
 * @param skip
 * @param limit
 * @returns list of orders
 */
export const getOrderItems = async (orderId: number) => {
    return await prisma.orderItem.findMany({
        where: {
            order_id: orderId,
        },
    });
};

/**
 * Get Order Item by ID
 * @param id
 * @returns Order Item
 */
export const getOrderItemById = async (id: number) => {
    return await prisma.orderItem.findUnique({
        where: {
            id,
        },
    });
};

/**
 * Create Order Item service
 * @param data
 * @returns created Order Item
 */
export const createOrderItem = async (data: Partial<OrderItem>) => {
    return prisma.$transaction(async (tx) => {
        const orderItem = await tx.orderItem.create({
            data: {
                product_id: data.product_id!,
                order_id: data.order_id!,
                quantity: data.quantity!,
                total_price: data.total_price!,
                price: data.price!,
                user_id: data.user_id!,
                notes: data.notes!,
            },
            include: {
                product: true,
            },
        });

        const inventory = await tx.inventory.findUnique({
            where: {
                product_id: data.product_id
            }
        });

        if (inventory) {
            await tx.inventory.update({
                where: {
                    product_id: data.product_id
                },
                data: {
                    reserved_qty: inventory.reserved_qty + data.quantity!
                }
            });
        }

        return orderItem;
    })
};

/**
 * Update Order Item service
 * @param id
 * @param data
 * @returns updated Order Item
 */
export const updateOrderItem = async (id: number, data: Partial<OrderItem>) => {
    return await prisma.orderItem.update({
        where: {
            id,
        },
        data: {
            product_id: data.product_id!,
            order_id: data.order_id!,
            quantity: data.quantity!,
            total_price: data.total_price!,
            price: data.price!,
            user_id: data.user_id!,
            notes: data.notes!,
        },
    });
};

/**
 * Delete Order Item
 * @param id
 */
export const deleteOrderItem = async (id: number) => {
    return await prisma.orderItem.delete({
        where: {
            id,
        },
    });
};

/**
 * Create Many Order Items
 * @param data 
 * @returns 
 */
export const createManyOrderItems = async (data: Prisma.OrderItemCreateManyInput[]) => {
    return await prisma.orderItem.createMany({ data });
}