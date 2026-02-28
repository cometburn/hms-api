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
     * Create Order Item service
     * @param data
     * @returns created Order Item
     */
    createOrderItemRepository = async (data: OrderItem) => {
        return await prisma.orderItem.create({
            data,
            include: {
                product: true,
            },
        });
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
