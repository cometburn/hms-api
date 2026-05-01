import * as  ProductRepository from "@/repositories/product.repository";
import { Product, ProductRequestParams } from "@/interfaces/types/product.types";

/**
 * Gets all products
 * @param hotelId
 * @param page
 * @param limit
 * @param search
 * @returns
 */
export const getProducts = async ({
    hotelId,
    page,
    limit,
    search,
    category,
    withStock,
}: ProductRequestParams) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        ProductRepository.getProducts(hotelId, search, category, withStock, skip, limit),
        ProductRepository.countProducts(hotelId, search, category, withStock),
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
export const createProduct = async (hotelId: number, data: Product) => {
    return await ProductRepository.createProductRepository({
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
export const updateProduct = async (hotelId: number, id: number, userId: number, data: Partial<Product>) => {
    return await ProductRepository.updateProductRepository(hotelId, id, userId, data);
};

/**
 * Delete product 
 * @param hotelId
 * @param id
 * @returns deleted product
 */
export const deleteProduct = async (hotelId: number, id: number) => {
    return await ProductRepository.deleteProductRepository(hotelId, id);
};