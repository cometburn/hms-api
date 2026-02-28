import { z } from "zod";

export const roomPromoSchema = z
    .object({
        name: z.string().min(1, "Name is required"),

        room_rate_id: z.coerce.number().int().positive("room_rate_id must be a positive integer"),

        start_datetime: z.coerce.date(),
        end_datetime: z.coerce.date(),

        days_of_week: z
            .array(z.number().int().min(0).max(6))
            .optional()
            .refine(
                (arr) => !arr || new Set(arr).size === arr.length,
                "days_of_week must contain unique values between 0 and 6"
            ),

        price: z.coerce.number().nonnegative("price must be >= 0"),
        note: z.string().optional().nullable(),
        extra_person_rate: z.coerce
            .number()
            .nonnegative("extra_person_rate must be >= 0")
            .optional(),
    })
    // ✅ new cross-field validation method
    .refine(
        (data) => {
            if (data.start_datetime && data.end_datetime) {
                return new Date(data.end_datetime) >= new Date(data.start_datetime);
            }
            return true;
        },
        {
            message: "date_end must be the same or after date_start",
            path: ["date_end"],
        }
    );

export type RoomPromoInput = z.infer<typeof roomPromoSchema>;
