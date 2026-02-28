import { OrderItem } from "@prisma/client";
import { OrderItemRepository } from "@/repositories/orderItem.repository";
import { OrderItemRequestParams } from "@/interfaces/types/orderItem.types";

export class OrderItemService {
    private orderItemRepository: OrderItemRepository;
    constructor() {
        this.orderItemRepository = new OrderItemRepository();
    }

    /**
     * Gets all Order Items
     * @param orderId
     * @returns
     */
    getOrderItemService = async ({ orderId }: OrderItemRequestParams) => {
        return await this.orderItemRepository.getOrderItemsRepository(orderId);
    };

    /**
     * Create Order Item service
     * @param data
     * @returns created Order Item
     */
    createOrderItemService = async (data: OrderItem) => {
        return await this.orderItemRepository.createOrderItemRepository(data);
    };

    /**
     * Deletes Order Item
     * @param orderItemId
     */
    deleteOrderItemService = async (orderItemId: number) => {
        return await this.orderItemRepository.deleteOrderItemRepository(orderItemId);
    };
}
