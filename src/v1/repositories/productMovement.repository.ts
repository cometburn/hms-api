import prisma from "@/helpers/prisma.helper";
import { ProductMovement } from "@/interfaces/types/productMovement.types";

/**
 * Gets all product movements
 * @param hotelId
 * @param search
 * @param skip
 * @param limit
 * @returns
 */
export const getProductMovements = async (
    hotelId: number,
    search: string,
    type: string,
    skip: number,
    limit: number
) => {
    return await prisma.productMovement.findMany({
        skip,
        take: limit,
        orderBy: [
            { created_at: "desc" },
            { product: { name: "asc" } },
        ],
        where: {
            product: {
                hotel_id: hotelId,
                ...(search && { name: { contains: search, mode: "insensitive" } }),
                ...(type && { type: { contains: type, mode: "insensitive" } }),
            },
        },
        include: {
            product: true,
            user: true,
            booking: {
                include: {
                    room: true,
                    room_rate: true,
                    user: true
                }
            },
            order: true,
            orderItem: {
                include: {
                    user: true
                }
            }
        },
    });
};

/**
 * Counts all products
 * @param hotelId
 * @param search
 * @returns
 */
export const countProductMovements = async (hotelId: number, search: string, type: string) => {
    return await prisma.inventory.count({
        where: {
            product: {
                hotel_id: hotelId,
                ...(search && { name: { contains: search, mode: "insensitive" } }),
                ...(type && { type: { contains: type, mode: "insensitive" } }),
            },
        },
    });
};

/**
 * Creates a product
 * @param data
 * @returns
 */
export const createProductMovement = async (data: ProductMovement) => {
    return prisma.$transaction(async (tx) => {

        const productMovement = await tx.productMovement.create({
            data: {
                user_id: data.user_id,
                product_id: data.product_id,
                type: data.type,
                quantity: data.quantity,
                unit_cost: data.unit_cost,
                source: data.source,
                note: data.note,
                booking_id: data.booking_id,
                order_id: data.order_id,
                order_item_id: data.order_item_id,
            }
        });

        const inventory = await tx.inventory.findUnique({
            where: {
                product_id: data.product_id
            }
        });

        if (inventory) {
            if (data.type === "in") {
                await tx.inventory.update({
                    where: {
                        product_id: data.product_id
                    },
                    data: {
                        quantity: inventory.quantity + data.quantity
                    }
                });
            }
        }

        return productMovement;
    });
};

/**
 * Updates a product
 * @param hotelId
 * @param id
 * @param data
 * @returns
 */
export const updateProductMovement = async (hotelId: number, productMovementId: number, userId: number, data: Partial<ProductMovement>) => {
    return prisma.$transaction(async (tx) => {
        // Get the original movement before updating
        const originalMovement = await tx.productMovement.findUnique({
            where: { id: productMovementId }
        });

        if (!originalMovement) throw new Error("Product movement not found");

        const productMovement = await tx.productMovement.update({
            where: {
                id: productMovementId,
                product: { hotel_id: hotelId }
            },
            data: {
                ...data,
                user_id: userId,
            }
        });

        const inventory = await tx.inventory.findUnique({
            where: { product_id: productMovement.product_id }
        });

        if (inventory) {
            // Reverse the original movement first, then apply the new one
            const reversedQty = inventory.quantity - originalMovement.quantity; // undo old
            const newQty = reversedQty + productMovement.quantity;              // apply new

            await tx.inventory.update({
                where: { product_id: productMovement.product_id },
                data: { quantity: newQty }
            });
        }

        return productMovement;
    });
};