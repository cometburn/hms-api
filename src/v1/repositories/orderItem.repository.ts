import prisma from "@/helpers/prisma.helper";
import { OrderItem, Prisma } from "@prisma/client";

export class OrderItemRepository {
    /**
     * Get Order Items
     * @param hotelId
     * @param search
     * @param skip
     * @param limit
     * @returns list of orders
     */
    getOrderItemsRepository = async (orderId: number) => {
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
    getOrderItemById = async (id: number) => {
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
    createOrderItemRepository = async (data: OrderItem) => {
        return prisma.$transaction(async (tx) => {
            const orderItem = await tx.orderItem.create({
                data,
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
                        reserved_qty: inventory.reserved_qty + data.quantity
                    }
                });
            }

            return orderItem;
        })
    };

    /**
     * Delete Order Item
     * @param id
     */
    deleteOrderItemRepository = async (id: number) => {
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
    async createManyOrderItems(data: Prisma.OrderItemCreateManyInput[]) {
        return await prisma.orderItem.createMany({ data });
    }
}
