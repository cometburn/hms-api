import prisma from "@/helpers/prisma.helper";
import { BookingCharge } from "@prisma/client";

export class BookingChargeRepository {
    /**
     * Create Many Booking Addons
     * @param data 
     * @returns 
     */
    async createManyCharges(data: Array<BookingCharge>) {
        return await prisma.bookingCharge.createMany({ data });
    }
}
