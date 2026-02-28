import prisma from "@/helpers/prisma.helper";
import { Order } from "@/interfaces/types/order.types";


export class OrderRepository {
    /**
     * Get Orders
     * @param bookingId
     * @returns list of orders
     */
    getOrders = async (bookingId: number) => {
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
    createOrder = async (data: Order) => {
        return await prisma.order.create({
            data,
        });
    };

    /**
     * Delete Order
     * @param id
     */
    deleteOrder = async (id: number) => {
        return await prisma.order.delete({
            where: {
                id,
            },
        });
    };
}
