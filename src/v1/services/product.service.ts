import { Room } from "@prisma/client";
import {
    getProducts,
    countProducts,
    createProductRepository,
    updateProductRepository,
    deleteProductRepository,
} from "@/repositories/product.repository";
import { ProductRequestParams } from "@/interfaces/types/product.types"

/**
 * Gets all products
 * @param hotelId
 * @param page
 * @param limit
 * @param search
 * @returns
 */
export const getProductsService = async ({
    hotelId,
    page,
    limit,
    search,
    category,
}: ProductRequestParams) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        getProducts(hotelId, search, category, skip, limit),
        countProducts(hotelId, search, category),
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
 * Creates a product
 * @param hotelId
 * @param data
 * @returns created product
 */
export const createProductService = async (hotelId: number, data: any) => {
    return await createProductRepository({
        ...data,
        hotel_id: hotelId,
    });
};

/**
 * Updates a product
 * @param hotelId
 * @param id
 * @param data
 * @returns updated product
 */
export const updateProductService = async (
    hotelId: number,
    id: number,
    data: Partial<Room>
) => {
    return await updateProductRepository(hotelId, id, data);
};

/**
 * Delete product service
 * @param hotelId
 * @param id
 * @returns deleted product
 */
export const deleteProductService = async (hotelId: number, id: number) => {
    return await deleteProductRepository(hotelId, id);
};
