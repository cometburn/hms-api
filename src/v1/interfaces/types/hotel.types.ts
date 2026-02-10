import { z } from "zod";

export const hotelSchema = z.object({
  name: z.string().min(3, "Name must be at least 6 characters"),
  address: z.string().min(6, "Address must be at least 6 characters"),
});

export const switchHotelSchema = z.object({
  hotel_id: z.number(),
});
