import prisma from "@/helpers/prisma.helper";
import { BookingCharge } from "@prisma/client";

/**
 * Create Many Booking Addons
 * @param data 
 * @returns 
 */
export const createManyCharges = async (data: Array<BookingCharge>) => {
    return await prisma.bookingCharge.createMany({ data });
}

/**
 * Create Booking Charge
 * @param data 
 * @returns 
 */
export const createCharge = async (data: Omit<BookingCharge, "id" | "created_at" | "updated_at">) => {
    return await prisma.bookingCharge.create({ data });
}   