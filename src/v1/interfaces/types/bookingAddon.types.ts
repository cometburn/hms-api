import { z } from "zod";

export const bookingAddonSchema = z.object({
    booking_id: z.number({ message: "Booking is required" }),
    room_id: z.number({ message: "Room is required" }),
    product_id: z.number({ message: "Product is required" }),
    quantity: z.number({ message: "Quantity is required" }).positive(),
    price: z.number({ message: "Price is required" }).positive(),
    total_price: z.number({ message: "Total price is required" }).positive(),
});

export type BookingAddon = z.infer<typeof bookingAddonSchema>;

export interface BookingAddonRequestParams {
    bookingId: number;
}
