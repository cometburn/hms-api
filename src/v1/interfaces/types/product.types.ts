import { PRODUCT_CATEGORY, PRODUCT_UNIT } from "@/constants";
import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    sku: z.string().optional().nullable(),
    category: z.enum(PRODUCT_CATEGORY),
    price: z.number().positive(),
    track_stock: z.boolean().default(true),
    unit: z.enum(PRODUCT_UNIT),
    is_active: z.boolean().default(true),
});

export type Product = z.infer<typeof productSchema>;

export interface ProductRequestParams {
    hotelId: number;
    page: number;
    limit: number;
    search: string;
    category: string;
}
