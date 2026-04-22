import { OrderRepository } from "@/repositories/order.repository";
import { Order, OrderRequestParams } from "@/interfaces/types/order.types";

export class OrderService {
    private orderRepo: OrderRepository;

    constructor() {
        this.orderRepo = new OrderRepository();
    }

    /**
     * Get Orders
     * @param bookingId
     * @returns
     */
    getOrders = async ({ bookingId }: OrderRequestParams) => {
        return await this.orderRepo.getOrders(bookingId);
    };

    /**
     * Get Order
     * @param bookingId
     * @returns
     */
    getOrder = async (bookingId: number) => {
        return await this.orderRepo.getOrder(bookingId);
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
     * Update Order 
     * @param data
     * @returns updated Order
     */
    updateOrder = async (hotelId: number, orderId: number, data: Partial<Order>) => {
        return await this.orderRepo.updateOrder(hotelId, orderId, data);
    };


    /**
     * Deletes Order
     * @param bookingId
     */
    deleteOrder = async (bookingId: number) => {
        return await this.orderRepo.deleteOrder(bookingId);
    };
}
