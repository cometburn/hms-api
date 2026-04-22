import { InventoryRepository } from "@/repositories/inventory.repository";
import { Inventory, InventoryRequestParams } from "@/interfaces/types/inventory.types";

export class InventoryService {
    private inventoryRepository: InventoryRepository;
    constructor() {
        this.inventoryRepository = new InventoryRepository();
    }
    /**
     * Gets all products
     * @param hotelId
     * @param page
     * @param limit
     * @param search
     * @returns
     */
    getInventories = async ({
        hotelId,
        page,
        limit,
        search,
        category,
    }: InventoryRequestParams) => {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.inventoryRepository.getInventories(hotelId, search, category, skip, limit),
            this.inventoryRepository.countInventories(hotelId, search, category),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    };

    /**
     * Gets Inventory
     * @param hotelId
     * @param inventoryId
     * @returns updated Inventory
     */
    getInventory = async (hotelId: number, inventoryId: number) => {
        return await this.inventoryRepository.getInventory(hotelId, inventoryId);
    };

    /**
     * Gets Inventory by Product Id
     * @param hotelId
     * @param productId
     * @returns updated Inventory
     */
    getInventoryByProductId = async (hotelId: number, productId: number) => {
        return await this.inventoryRepository.getInventoryByProductId(hotelId, productId);
    };


    /**
     * Updates Inventory
     * @param hotelId
     * @param inventoryId
     * @param data
     * @returns updated Inventory
     */
    updateInventory = async (hotelId: number, inventoryId: number, data: Partial<Inventory>) => {
        return await this.inventoryRepository.updateInventory(hotelId, inventoryId, data);
    };

    /**
     * Creates Inventory
     * @param data
     * @returns created Inventory
     */
    createInventory = async (data: Inventory) => {
        return await this.inventoryRepository.createInventory(data);
    };

    /**
     * Deletes Inventory
     * @param hotelId
     * @param inventoryId
     */
    deleteInventory = async (hotelId: number, inventoryId: number) => {
        return await this.inventoryRepository.deleteInventory(hotelId, inventoryId);
    };
}
