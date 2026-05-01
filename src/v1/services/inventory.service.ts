import * as InventoryRepository from "@/repositories/inventory.repository";
import { Inventory, InventoryRequestParams } from "@/interfaces/types/inventory.types";

/**
 * Gets all products
 * @param hotelId
 * @param page
 * @param limit
 * @param search
 * @returns
 */
export const getInventories = async ({
    hotelId,
    page,
    limit,
    search,
    category,
}: InventoryRequestParams) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        InventoryRepository.getInventories(hotelId, search, category, skip, limit),
        InventoryRepository.countInventories(hotelId, search, category),
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
export const getInventory = async (hotelId: number, inventoryId: number) => {
    return await InventoryRepository.getInventory(hotelId, inventoryId);
};

/**
 * Gets Inventory by Product Id
 * @param hotelId
 * @param productId
 * @returns updated Inventory
 */
export const getInventoryByProductId = async (hotelId: number, productId: number) => {
    return await InventoryRepository.getInventoryByProductId(hotelId, productId);
};


/**
 * Updates Inventory
 * @param hotelId
 * @param inventoryId
 * @param data
 * @returns updated Inventory
 */
export const updateInventory = async (hotelId: number, inventoryId: number, data: Partial<Inventory>) => {
    return await InventoryRepository.updateInventory(hotelId, inventoryId, data);
};

/**
 * Creates Inventory
 * @param data
 * @returns created Inventory
 */
export const createInventory = async (data: Inventory) => {
    return await InventoryRepository.createInventory(data);
};

/**
 * Deletes Inventory
 * @param hotelId
 * @param inventoryId
 */
export const deleteInventory = async (hotelId: number, inventoryId: number) => {
    return await InventoryRepository.deleteInventory(hotelId, inventoryId);
};