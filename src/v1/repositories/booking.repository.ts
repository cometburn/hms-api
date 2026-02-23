import prisma from "@/helpers/prisma.helper";
import { Booking } from "@prisma/client";

/**
 * Get Bookings
 * @param hotelId
 * @param search
 * @param skip
 * @param limit
 * @returns list of bookings
 */
export const getBookings = async (
    hotelId: number,
    search: string,
    skip: number,
    limit: number
) => {
    return await prisma.booking.findMany({
        where: {
            hotel_id: hotelId,
        },
        orderBy: {
            room: {
                name: "asc"
            }
        },
        skip,
        take: limit,
        include: {
            room: true
        },
    });
};

/**
 * Count Bookings
 * @param hotelId
 * @param search
 * @returns count of bookings
 */
export const countBookings = async (hotelId: number, search: string) => {
    return await prisma.booking.count({
        where: {
            hotel_id: hotelId,
        },
    });
};

/**
 * Create Booking repository
 * @param data
 * @returns created Booking
 */
export const createBookingRepository = async (data: any) => {
    return await prisma.booking.create({ data });
};

/**
 * Update Booking repository
 * @param hotelId
 * @param id
 * @param data
 * @returns updated Booking
 */
export const updateBookingRepository = async (
    hotelId: number,
    id: number,
    data: Partial<Booking>
) => {
    return prisma.booking.update({
        where: { id, hotel_id: hotelId },
        data,
    });
}

/**
 * Deletes a Booking
 * @param hotelId
 * @param id
 * @returns
 */
export const deleteBookingRepository = async (hotelId: number, id: number) => {
    return prisma.booking.delete({
        where: {
            id,
            hotel_id: hotelId,
        },
    });
};

/**
 * Find Booking by Id
 * @param hotelId
 * @param bookingId
 * @returns updated Booking
 */
export const findBookingById = async (hotelId: number, bookingId: number) => {
    return await prisma.booking.findFirst({
        where: {
            hotel_id: hotelId,
            id: bookingId
        },
        include: {
            booking_addons: {
                include: {
                    product: {
                        select: {
                            name: true,
                            sku: true,
                            category: true,
                        }
                    }
                }
            },
            orders: {
                include: {
                    order_items: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    sku: true,
                                    category: true,
                                }
                            }
                        }
                    }
                }
            },
            room_rate: true,
            user: {
                select: {
                    first_name: true,
                    last_name: true,
                    email: true,
                    avatar: true
                }
            }
        }
    });
};

/**
 * Update Booking by Id
 * @param hotelId
 * @param bookingId
 * @param data
 * @returns updated Booking
 */
export const updateBookingById = async (hotelId: number, bookingId: number, data: any) => {
    return await prisma.booking.update({ where: { id: bookingId, hotel_id: hotelId }, data });
};