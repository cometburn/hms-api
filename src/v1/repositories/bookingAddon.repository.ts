import prisma from "@/helpers/prisma.helper";
import { BookingAddon } from "@prisma/client";

/**
 * Get Booking Addons
 * @param hotelId
 * @param search
 * @param skip
 * @param limit
 * @returns list of bookings
 */
export const getBookingAddOns = async (bookingId: number) => {
    return await prisma.bookingAddon.findMany({
        where: {
            booking_id: bookingId,
        },
    });
};

/**
 * Create Booking Addon Repo
 * @param data
 * @returns created Booking Addon
 */
export const createBookingAddon = async (data: BookingAddon) => {
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
export const deleteBookingAddon = async (id: number) => {
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
export const createManyAddons = async (data: Array<BookingAddon>) => {
    return await prisma.bookingAddon.createMany({ data });
}
