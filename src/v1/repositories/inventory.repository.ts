import prisma from "@/helpers/prisma.helper";
import { Prisma } from "@prisma/client";
import { Inventory } from "@/interfaces/types/inventory.types";

/**
 * Gets all inventories
 * @param hotelId
 * @param search
 * @param skip
 * @param limit
 * @returns
 */
export const getInventories = async (
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
export const countInventories = async (hotelId: number, search: string, category: string) => {
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
export const getInventory = async (hotelId: number, inventoryId: number) => {
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
export const getInventoryByProductId = async (hotelId: number, productId: number) => {
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
export const createInventory = async (data: any) => {
    return await prisma.inventory.create({ data });
};

/**
 * Updates a inventory
 * @param hotelId
 * @param id
 * @param data
 * @returns
 */
export const updateInventory = async (hotelId: number, id: number, data: Partial<Inventory>) => {
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
export const deleteInventory = async (hotelId: number, id: number) => {
    return prisma.inventory.delete({
        where: {
            id,
            product: { hotel_id: hotelId }
        },
    });
};

/**
 * Increments stock
 * @param productId
 * @param quantity
 * @returns
 */
export const incrementStock = async (productId: number, quantity: number) => {
    return await prisma.inventory.update({
        where: { product_id: productId },
        data: {
            quantity: {
                increment: quantity,
            },
        },
    });
};

/**
 * Decrements stock
 * @param productId
 * @param quantity
 * @returns
 */
export const decrementStock = async (productId: number, quantity: number) => {
    const inventory = await prisma.inventory.findUnique({ where: { product_id: productId } });

    if (!inventory || inventory.quantity < quantity) {
        throw new Error(`Insufficient stock for product ${productId}`);
    }

    return await prisma.inventory.update({
        where: { product_id: productId },
        data: {
            quantity: { decrement: quantity },
        },
    });
};