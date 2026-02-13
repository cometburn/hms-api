import { z } from "zod";

export const roomPromoSchema = z
  .object({
    name: z.string().min(1, "Name is required"),

    room_rate_id: z.coerce
      .number()
      .int()
      .positive("room_rate_id must be a positive integer"),

    date_start: z.coerce.date().optional(),
    date_end: z.coerce.date().optional(),

    days_of_week: z
      .array(z.number().int().min(0).max(6))
      .optional()
      .refine(
        (arr) => !arr || new Set(arr).size === arr.length,
        "days_of_week must contain unique values between 0 and 6"
      ),

    start_time: z
      .string()
      .regex(
        /^(?:[01]\d|2[0-3]):[0-5]\d$/,
        "time_start must be in HH:MM 24-hour format"
      )
      .optional(),

    end_time: z
      .string()
      .regex(
        /^(?:[01]\d|2[0-3]):[0-5]\d$/,
        "time_end must be in HH:MM 24-hour format"
      )
      .optional(),

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
      if (data.date_start && data.date_end) {
        return new Date(data.date_end) >= new Date(data.date_start);
      }
      return true;
    },
    {
      message: "date_end must be the same or after date_start",
      path: ["date_end"],
    }
  );

export type RoomPromoInput = z.infer<typeof roomPromoSchema>;
