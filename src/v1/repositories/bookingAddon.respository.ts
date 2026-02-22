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
export const getBookingAddOnsRepository = async (bookingId: number) => {
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
export const createBookingAddonRepository = async (data: BookingAddon) => {
    return await prisma.bookingAddon.create({
        data, include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    category: true,
                    unit: true,
                }
            }
        }
    });
};

/**
 * Delete Booking Addon
 * @param hotelId
 * @param id
 */
export const deleteBookingAddonRepository = async (
    id: number
) => {
    return await prisma.bookingAddon.delete({
        where: {
            id,
        },
    });
};