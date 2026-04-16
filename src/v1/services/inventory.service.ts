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
    getInventoriesService = async ({
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
}
