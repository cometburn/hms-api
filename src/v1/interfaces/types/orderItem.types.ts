import { z } from "zod";
import { productSchema } from "./product.types";

export const orderItemCreateSchema = z
    .object({
        id: z.number().optional(),
        product_id: z.number({ message: "Product is required" }),
        quantity: z.number({ message: "Quantity is required" }).positive(),
        price: z.number({ message: "Unit price is required" }).positive(),
        total_price: z.number({ message: "Total price is required" }).positive(),
        notes: z.string().optional().nullable(),
        product: productSchema.partial().optional(),
        user_id: z.number().optional(),
        transferred_from_booking_id: z.number().nullable(),
    });

export const orderItemSchema = z
    .object({
        order_id: z.number({ message: "Order is required" }),
        ...orderItemCreateSchema.shape,
    });

export const directOrderItemSchema = z
    .object({
        order_id: z.number().optional(),
        ...orderItemCreateSchema.shape,
    });

export type OrderItem = z.infer<typeof orderItemSchema>;
export type DirectOrderItem = z.infer<typeof directOrderItemSchema>;

export interface OrderItemRequestParams {
    orderId: number;
}
