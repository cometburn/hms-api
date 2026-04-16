import prisma from "@/helpers/prisma.helper";
import { Prisma } from "@prisma/client";
import { Product } from "@/interfaces/types/product.types";

export class ProductMovementRepository {
    /**
     * Gets all product movements
     * @param hotelId
     * @param search
     * @param skip
     * @param limit
     * @returns
     */
    getProductMovements = async (
        hotelId: number,
        search: string,
        category: string,
        skip: number,
        limit: number
    ) => {

        const where: Prisma.ProductWhereInput = {
            hotel_id: hotelId,
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
            ];
        }

        if (category) {
            where.category = category;
        }

        return await prisma.product.findMany({
            where: where,
            orderBy: { name: "asc" },
            skip,
            take: limit,
            include: {
                product_history: {
                    orderBy: { created_at: "desc" },
                    include: {
                        user: { select: { first_name: true, last_name: true } },
                    },
                },
                inventory: true,
            },
        });
    };

    /**
     * Counts all products
     * @param hotelId
     * @param search
     * @returns
     */
    countProductMovements = async (hotelId: number, search: string, category: string) => {
        const where: Prisma.ProductWhereInput = {
            hotel_id: hotelId,
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
            ];
        }

        if (category) {
            where.category = category;
        }

        return await prisma.product.count({
            where: where,
        });
    };

    /**
     * Creates a product
     * @param data
     * @returns
     */
    createProductMovementRepository = async (data: any) => {
        return prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data
            });

            if (product.track_stock) {
                await tx.inventory.create({
                    data: {
                        product_id: product.id,
                        quantity: 0,
                        reserved_qty: 0,
                    },
                });
            }

            return product;
        });
    };

    /**
     * Updates a product
     * @param hotelId
     * @param id
     * @param data
     * @returns
     */
    updateProductMovementRepository = async (hotelId: number, id: number, userId: number, data: Partial<Product>) => {
        const current = await prisma.product.findUniqueOrThrow({
            where: { id, hotel_id: hotelId },
        });

        // const historyLogs = TRACKED_FIELDS
        //     .filter((field) => {
        //         const incoming = data[field];
        //         const existing = current[field];
        //         return incoming !== undefined && incoming !== existing;
        //     })
        //     .map((field) => ({
        //         product_id: id,
        //         changed_by: userId,
        //         field,
        //         old_value: current[field] != null ? String(current[field]) : "",
        //         new_value: data[field] != null ? String(data[field]) : "",
        //     }));

        // return await prisma.$transaction(async (tx) => {
        //     const updated = await tx.product.update({
        //         where: { id, hotel_id: hotelId },
        //         data,
        //     });

        //     if (historyLogs.length > 0) {
        //         await tx.productHistory.createMany({ data: historyLogs });
        //     }

        //     if (data.track_stock === true && !current.track_stock) {
        //         await tx.inventory.upsert({
        //             where: { product_id: id },
        //             create: { product_id: id, quantity: 0, reserved_qty: 0 },
        //             update: {},
        //         });
        //     }

        //     return updated;
        // });
    };
}
