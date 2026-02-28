import { z } from "zod";

export const bookingChargeSchema = z.object({
    booking_id: z.number({ message: "Booking is required" }).optional(),
    room_id: z.number({ message: "Room is required" }).optional(),
    name: z.string({ message: "Name is required" }),
    price: z.number({ message: "Price is required" }).positive(),
});

export type BookingCharge = z.infer<typeof bookingChargeSchema>;

export interface BookingChargeRequestParams {
    bookingId: number;
}
