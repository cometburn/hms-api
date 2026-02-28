import { z } from "zod";
import { BOOKING_STATUS, PAYMENT_STATUS, PAYMENT_TYPE } from "@/constants/index";
import { bookingChargeSchema } from "./bookingCharge.types";
import { bookingAddonSchema } from "./bookingAddon.types";
import { orderSchema } from "./order.types";
import { orderItemSchema } from "./orderItem.types";

export const bookingSchema = z
    .object({
        id: z.number().optional(),
        room_id: z.number(),
        room_rate_id: z.number(),
        start_datetime: z
            .string({ message: "Start date is required" })
            .or(z.date({ message: "Start date is required" })),
        end_datetime: z
            .string({ message: "Start date is required" })
            .or(z.date({ message: "End date is required" })),
        extra_person: z.number().optional(),
        total_price: z.number().positive(),
        status: z.enum(BOOKING_STATUS),
        payment_status: z.enum(PAYMENT_STATUS).optional().nullable(),
        payment_type: z.enum(PAYMENT_TYPE).optional().nullable(),
        note: z.string().optional(),
    })
    .refine(
        (data) => {
            return data.start_datetime <= data.end_datetime;
        },
        {
            message: "Start date must not be greater than end date",
            path: ["start_datetime"],
        }
    );

const baseBookingSchema = z.object({
    room_id: z.number(),
    room_rate_id: z.number().min(1, "Room rate is required"),
    start_datetime: z.coerce.date(),
    end_datetime: z.coerce.date(),
    extra_person: z.number().optional().default(0),
    status: z.enum(BOOKING_STATUS),
    note: z.string().optional().nullable(),
}).refine(
    (data) => data.start_datetime <= data.end_datetime,
    {
        message: "Start date must not be greater than end date",
        path: ["start_datetime"],
    }
);

export const updateBookingSchema = baseBookingSchema.extend({
    id: z.number(),
    total_price: z.number().min(0),
    payment_status: z.enum(PAYMENT_STATUS, {
        message: "Invalid payment status",
    }).optional(),
    payment_type: z.enum(PAYMENT_TYPE, {
        message: "Invalid payment type",
    }).optional(),
});


export const transferBookingSchema = baseBookingSchema.extend({
    id: z.number(),
    original_booking_id: z.number(),
    room_type_id: z.number({ message: "Room type is required" }),
    room_id: z.number().min(1, "Room is required"),
    booking_charges: z.array(bookingChargeSchema.partial()).optional(),
    booking_addons: z.array(bookingAddonSchema.partial()).optional(),
    orders: z.array(orderItemSchema.partial()).optional(),
})


export type Booking = z.infer<typeof bookingSchema>;
export type TransferBooking = z.infer<typeof transferBookingSchema>;
