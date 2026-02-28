import { z } from "zod";

export const orderItemSchema = z.object({
    order_id: z.number({ message: "Order is required" }),
    product_id: z.number({ message: "Product is required" }),
    quantity: z.number({ message: "Quantity is required" }).positive(),
    price: z.number({ message: "Unit price is required" }).positive(),
    total_price: z.number({ message: "Total price is required" }).positive(),
    notes: z.string().optional().nullable(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export interface OrderItemRequestParams {
    orderId: number;
}
