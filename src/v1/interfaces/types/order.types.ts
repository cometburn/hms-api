import { z } from "zod";
import { ORDER_STATUS } from "@/constants";
import { directOrderItemSchema, orderItemSchema } from "./orderItem.types";

export const orderCreateSchema = z
    .object({
        id: z.number().optional(),
        hotel_id: z.number().optional(),
        booking_id: z.number().optional(),
        total_price: z.number({ message: "Total price is required" }).positive().optional(),
        status: z.enum(ORDER_STATUS).optional(),
        notes: z.string().optional().nullable(),
        transferred_from_booking_id: z.number().optional(),
    });

export const orderSchema = z
    .object({
        ...orderCreateSchema.shape,
        order_items: z.array(orderItemSchema).optional(),
    });

export const directOrderSchema = z
    .object({
        ...orderCreateSchema.shape,
        order_items: z.array(directOrderItemSchema).optional(),
    });

export type Order = z.infer<typeof orderSchema>;
export type DirectOrder = z.infer<typeof directOrderSchema>;

export interface OrderRequestParams {
    hotelId: number;
    bookingId: number | null;
    status: string;
    page: number;
    limit: number;
}