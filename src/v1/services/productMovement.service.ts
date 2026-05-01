import * as ProductMovementRepository from "@/repositories/productMovement.repository";
import { ProductMovement, ProductMovementRequestParams } from "@/interfaces/types/productMovement.types";

/**
 * Gets all product movements
 * @param hotelId
 * @param page
 * @param limit
 * @param search
 * @returns
 */
export const getProductMovements = async ({
    hotelId,
    page,
    limit,
    search,
    type,
}: ProductMovementRequestParams) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        ProductMovementRepository.getProductMovements(hotelId, search, type, skip, limit),
        ProductMovementRepository.countProductMovements(hotelId, search, type),
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
 * Creates a product movement 
 * @param hotelId
 * @param data
 * @returns created product movement
 */
export const createProductMovement = async (userId: number, data: ProductMovement) => {
    return await ProductMovementRepository.createProductMovement({
        ...data,
        user_id: userId,
    });
};

/**
 * Updates a product movement 
 * @param hotelId
 * @param id
 * @param data
 * @returns updated product movement
 */
export const updateProductMovement = async (hotelId: number, productMovementId: number, userId: number, data: Partial<ProductMovement>) => {
    return await ProductMovementRepository.updateProductMovement(hotelId, productMovementId, userId, data);
};
