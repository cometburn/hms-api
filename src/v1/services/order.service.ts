import { OrderRepository } from "@/repositories/order.repository";
import { Order, OrderRequestParams } from "@/interfaces/types/order.types";

export class OrderService {
    private orderRepo: OrderRepository;

    constructor() {
        this.orderRepo = new OrderRepository();
    }

    /**
     * Gets all Orders
     * @param bookingId
     * @returns
     */
    getOrder = async ({ bookingId }: OrderRequestParams) => {
        return await this.orderRepo.getOrders(bookingId);
    };

    /**
     * Create Order 
     * @param data
     * @returns created Order
     */
    createOrder = async (data: Order) => {
        return await this.orderRepo.createOrder(data);
    };

    /**
     * Deletes Order
     * @param bookingId
     */
    deleteOrder = async (bookingId: number) => {
        return await this.orderRepo.deleteOrder(bookingId);
    };
}
