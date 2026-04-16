import { z } from "zod";

export const inventorySchema = z.object({
    product_id: z.number({ message: "Product is required" }),
    quantity: z.number().positive(),
    reserved_qty: z.number().positive().default(0),
});

export type Inventory = z.infer<typeof inventorySchema>;

export interface InventoryRequestParams {
    hotelId: number;
    page: number;
    limit: number;
    search: string;
    category: string;
}
