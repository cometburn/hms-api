import { OrderItem } from "@prisma/client";
import { OrderItemRepository } from "@/repositories/orderItem.repository";
import { InventoryRepository } from "@/repositories/inventory.repository";
import { NotFoundError } from "@/helpers/error.helper";

export class OrderItemService {
    private orderItemRepository: OrderItemRepository;
    private inventoryRepository: InventoryRepository;
    constructor() {
        this.orderItemRepository = new OrderItemRepository();
        this.inventoryRepository = new InventoryRepository();
    }

    /**
     * Gets all Order Items
     * @param orderId
     * @returns
     */
    getOrderItems = async (orderId: number) => {
        return await this.orderItemRepository.getOrderItemsRepository(orderId);
    };

    /**
     * Create Order Item service
     * @param data
     * @returns created Order Item
     */
    createOrderItem = async (data: OrderItem) => {
        return await this.orderItemRepository.createOrderItemRepository(data);
    };

    /**
     * Deletes Order Item
     * @param orderItemId
     */
    deleteOrderItem = async (hotelId: number, orderItemId: number) => {
        const orderItem = await this.orderItemRepository.getOrderItemById(orderItemId);
        if (orderItem) {

            const inventory = await this.inventoryRepository.getInventoryByProductId(hotelId, orderItem.product_id);

            if (!inventory) throw new NotFoundError("Inventory not found");

            await this.inventoryRepository.updateInventory(hotelId, inventory.id, {
                reserved_qty: inventory.reserved_qty - orderItem.quantity
            });

            return await this.orderItemRepository.deleteOrderItemRepository(orderItemId);
        } else {
            throw new NotFoundError("Order item not found");
        }
    };
}
