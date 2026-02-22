import prisma from "@/helpers/prisma.helper";
import { Product } from "@/interfaces/types/product.types";

/**
 * Gets all products
 * @param hotelId
 * @param search
 * @param skip
 * @param limit
 * @returns
 */
export const getProducts = async (
    hotelId: number,
    search: string,
    category: string,
    skip: number,
    limit: number
) => {
    return await prisma.product.findMany({
        where: {
            hotel_id: hotelId,
            name: {
                contains: search,
                mode: "insensitive",
            },
            category: {
                equals: category,
            },
        },
        orderBy: { name: "asc" },
        skip,
        take: limit
    });
};

/**
 * Counts all products
 * @param hotelId
 * @param search
 * @returns
 */
export const countProducts = async (hotelId: number, search: string, category: string) => {
    return await prisma.product.count({
        where: {
            hotel_id: hotelId,
            name: {
                contains: search,
                mode: "insensitive",
            },
            category: {
                equals: category,
            },
        },
    });
};

/**
 * Creates a product
 * @param data
 * @returns
 */
export const createProductRepository = async (data: any) => {
    return await prisma.product.create({ data });
};

/**
 * Updates a product
 * @param hotelId
 * @param id
 * @param data
 * @returns
 */
export const updateProductRepository = async (
    hotelId: number,
    id: number,
    data: Partial<Product>
) => {
    return prisma.product.update({
        where: { id, hotel_id: hotelId },
        data,
    });
}

/**
 * Deletes a product
 * @param hotelId
 * @param id
 * @returns
 */
export const deleteProductRepository = async (hotelId: number, id: number) => {
    return prisma.product.delete({
        where: {
            id,
            hotel_id: hotelId,
        },
    });
};
