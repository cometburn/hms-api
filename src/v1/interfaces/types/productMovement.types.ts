import { PRODUCT_MOVEMENT_TYPE } from "@/constants";
import { z } from "zod";

export const productMovementSchema = z.object({
    id: z.number().optional(),
    user_id: z.number().optional(),
    product_id: z.number(),
    booking_id: z.number().optional().nullable(),
    order_id: z.number().optional().nullable(),
    order_item_id: z.number().optional().nullable(),
    type: z.enum(PRODUCT_MOVEMENT_TYPE),
    quantity: z.number().positive(),
    unit_cost: z.number().positive(),
    source: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
});

export type ProductMovement = z.infer<typeof productMovementSchema>;

export interface ProductMovementRequestParams {
    hotelId: number;
    page: number;
    limit: number;
    search: string;
    type: string;
}
