import { z } from "zod";
import { ORDER_STATUS } from "@/constants";
import { orderItemSchema } from "./orderItem.types";

export const orderItems = z.array(orderItemSchema.partial()).optional().nullable()

export const orderSchema = z.object({
    id: z.number().optional(),
    hotel_id: z.number({ message: "Hotel is required" }),
    booking_id: z.number({ message: "Booking is required" }),
    total_price: z.number({ message: "Total price is required" }).positive(),
    status: z.enum(ORDER_STATUS),
    notes: z.string().optional().nullable(),
    transferred_from_booking_id: z.number().optional().nullable(),
});

export type Order = z.infer<typeof orderSchema>;

export interface OrderRequestParams {
    bookingId: number;
}
