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
export const getBookings = async (hotelId: number, search: string, skip: number, limit: number, status: string = "check_out") => {
    return await prisma.booking.findMany({
        where: {
            hotel_id: hotelId,
            status,
        },
        orderBy: {
            updated_at: "desc",
        },
        skip,
        take: limit,
        include: {
            room: {
                include: {
                    room_type: true,
                }
            }
        },
    });
}

/**
 * Count Bookings
 * @param hotelId
 * @param search
 * @returns
 */
export const countBookings = async (hotelId: number, search: string, status: string = "check_out") => {
    return await prisma.booking.count({
        where: {
            hotel_id: hotelId,
            status
        },
    });
}

/**
 * Create Booking repository
 * @param data
 * @returns
 */
export const createBooking = async (data: any) => {
    return await prisma.booking.create({ data });
}

/**
 * Update Booking repository
 * @param hotelId
 * @param id
 * @param data
 * @returns
 */
export const updateBooking = async (hotelId: number, id: number, data: Partial<Booking>) => {
    return prisma.booking.update({
        where: { id, hotel_id: hotelId },
        data,
    });
}

/**
 * Delete Booking repository
 * @param hotelId
 * @param id
 * @returns
 */
export const deleteBooking = async (hotelId: number, id: number) => {
    return prisma.booking.delete({
        where: {
            id,
            hotel_id: hotelId,
        },
    });
}

/**
 * Find Booking by Id
 * @param hotelId
 * @param bookingId
 * @returns
 */
export const findBookingById = async (hotelId: number, bookingId: number) => {
    return await prisma.booking.findFirst({
        where: {
            hotel_id: hotelId,
            id: bookingId,
        },
        include: {
            booking_charges: {
                include: {
                    room: true,
                }
            },
            booking_addons: {
                include: {
                    product: {
                        select: {
                            name: true,
                            sku: true,
                            category: true,
                        },
                    },
                },
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
                                },
                            },
                        },
                    },
                },
            },
            room: true,
            room_rate: true,
            user: {
                select: {
                    first_name: true,
                    last_name: true,
                    email: true,
                    avatar: true,
                },
            },
        },
    });
}

/**
 * Find Booking by Room Id
 * @param hotelId 
 * @param roomId 
 */
export const findBookingByRoomId = async (hotelId: number, roomId: number) => {
    return await prisma.booking.findFirst({
        where: {
            hotel_id: hotelId,
            room_id: roomId,
        },
    })
}

/**
 * Update Booking by Id
 * @param hotelId
 * @param bookingId
 * @param data
 * @returns
 */
export const updateBookingById = async (hotelId: number, bookingId: number, data: any) => {
    return await prisma.booking.update({ where: { id: bookingId, hotel_id: hotelId }, data });
}

/**
 * Update Booking Status
 * @param bookingId 
 * @param status 
 * @param note 
 * @returns 
 */
export const updateBookingStatus = async (bookingId: number, status: string, note?: string) => {
    return await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status,
            ...(note && { note })
        }
    });
}

/**
 * Get Booking Transfer History
 * @param bookingId 
 * @returns 
 */
export const getBookingTransferHistory = async (bookingId: number) => {
    return await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            transferred_from_booking: {
                include: {
                    room: true,
                    booking_addons: true,
                    orders: {
                        include: { order_items: true }
                    }
                }
            },
            booking_addons: {
                include: {
                    product: true
                }
            },
            orders: {
                include: {
                    order_items: {
                        include: {
                            product: true
                        }
                    }
                }
            }
        }
    });
}
