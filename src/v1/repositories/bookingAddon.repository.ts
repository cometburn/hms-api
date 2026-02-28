import prisma from "@/helpers/prisma.helper";
import { BookingAddon } from "@prisma/client";

export class BookingAddonRepository {
    /**
     * Get Booking Addons
     * @param hotelId
     * @param search
     * @param skip
     * @param limit
     * @returns list of bookings
     */
    getBookingAddOnsRepository = async (bookingId: number) => {
        return await prisma.bookingAddon.findMany({
            where: {
                booking_id: bookingId,
            },
        });
    };

    /**
     * Create Booking Addon service
     * @param data
     * @returns created Booking Addon
     */
    createBookingAddonRepository = async (data: BookingAddon) => {
        return await prisma.bookingAddon.create({
            data,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        category: true,
                        unit: true,
                    },
                },
            },
        });
    };

    /**
     * Delete Booking Addon
     * @param hotelId
     * @param id
     */
    deleteBookingAddonRepository = async (id: number) => {
        return await prisma.bookingAddon.delete({
            where: {
                id,
            },
        });
    };

    /**
     * Create Many Booking Addons
     * @param data 
     * @returns 
     */
    async createManyAddons(data: Array<BookingAddon>) {
        return await prisma.bookingAddon.createMany({ data });
    }
}
