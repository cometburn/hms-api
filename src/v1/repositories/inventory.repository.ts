import prisma from "@/helpers/prisma.helper";
import { Prisma } from "@prisma/client";
import { Inventory } from "@/interfaces/types/inventory.types";

export class InventoryRepository {
    /**
     * Gets all inventories
     * @param hotelId
     * @param search
     * @param skip
     * @param limit
     * @returns
     */
    getInventories = async (
        hotelId: number,
        search: string,
        category: string,
        skip: number,
        limit: number
    ) => {
        return await prisma.inventory.findMany({
            skip,
            take: limit,
            orderBy: [
                { product: { name: "asc" } },
            ],
            where: {
                product: {
                    hotel_id: hotelId,
                    ...(search && { name: { contains: search, mode: "insensitive" } }),
                    ...(category && { category: { contains: category, mode: "insensitive" } }),
                    inventory: {
                        isNot: null
                    }
                },
            },
            include: {
                product: true,
            },
        });
    };

    /**
     * Counts all inventories
     * @param hotelId
     * @param search
     * @returns
     */
    countInventories = async (hotelId: number, search: string, category: string) => {
        return await prisma.inventory.count({
            where: {
                product: {
                    hotel_id: hotelId,
                    ...(search && { name: { contains: search, mode: "insensitive" } }),
                    ...(category && { category: { contains: category, mode: "insensitive" } }),
                    inventory: {
                        isNot: null
                    }
                },
            },
        });
    };

    /**
     * Gets Inventory
     * @param hotelId
     * @param inventoryId
     * @returns updated Inventory
     */
    getInventory = async (hotelId: number, inventoryId: number) => {
        return await prisma.inventory.findUnique({
            where: {
                id: inventoryId,
                product: { hotel_id: hotelId }
            },
        });
    };

    /**
     * Gets Inventory by Product Id
     * @param hotelId
     * @param productId
     * @returns updated Inventory
     */
    getInventoryByProductId = async (hotelId: number, productId: number) => {
        return await prisma.inventory.findFirst({
            where: {
                product_id: productId,
                product: { hotel_id: hotelId }
            },
        });
    };

    /**
     * Creates a inventory
     * @param data
     * @returns
     */
    createInventory = async (data: any) => {
        return await prisma.inventory.create({ data });
    };

    /**
     * Updates a inventory
     * @param hotelId
     * @param id
     * @param data
     * @returns
     */
    updateInventory = async (hotelId: number, id: number, data: Partial<Inventory>) => {
        return prisma.inventory.update({
            where: {
                id,
                product: { hotel_id: hotelId }
            },
            data,
        });
    };

    /**
     * Deletes a inventory
     * @param hotelId
     * @param id
     * @returns
     */
    deleteInventory = async (hotelId: number, id: number) => {
        return prisma.inventory.delete({
            where: {
                id,
                product: { hotel_id: hotelId }
            },
        });
    };
}
