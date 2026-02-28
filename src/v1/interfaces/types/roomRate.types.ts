import { z } from "zod";

export const roomRateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    room_type_id: z.number(),
    rate_type: z.enum(["hourly", "daily", "weekly", "monthly"]),
    duration_minutes: z.number().min(1, "Must be greater than 0"),
    base_price: z.number().min(1, "Must be greater than 0"),
    extra_person_rate: z.number().default(0),
    overstay_rate: z.number().default(0),
    is_dynamic: z.boolean().default(false),
    id: z.number().optional(),
});

export type RoomRate = z.infer<typeof roomRateSchema>;
