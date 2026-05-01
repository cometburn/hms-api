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