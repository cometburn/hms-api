import prisma from "@/helpers/prisma.helper";
import { Booking } from "@prisma/client";

export class BookingRepository {
    /**
     * Get Bookings
     * @param hotelId
     * @param search
     * @param skip
     * @param limit
     * @returns list of bookings
     */
    async getBookings(hotelId: number, search: string, skip: number, limit: number) {
        return await prisma.booking.findMany({
            where: {
                hotel_id: hotelId,
            },
            orderBy: {
                room: {
                    name: "asc",
                },
            },
            skip,
            take: limit,
            include: {
                room: true,
            },
        });
    }

    /**
     * Count Bookings
     * @param hotelId
     * @param search
     * @returns
     */
    async countBookings(hotelId: number, search: string) {
        return await prisma.booking.count({
            where: {
                hotel_id: hotelId,
            },
        });
    }

    /**
     * Create Booking repository
     * @param data
     * @returns
     */
    async createBooking(data: any) {
        return await prisma.booking.create({ data });
    }

    /**
     * Update Booking repository
     * @param hotelId
     * @param id
     * @param data
     * @returns
     */
    async updateBooking(hotelId: number, id: number, data: Partial<Booking>) {
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
    async deleteBooking(hotelId: number, id: number) {
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
    async findBookingById(hotelId: number, bookingId: number) {
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
     * Update Booking by Id
     * @param hotelId
     * @param bookingId
     * @param data
     * @returns
     */
    async updateBookingById(hotelId: number, bookingId: number, data: any) {
        return await prisma.booking.update({ where: { id: bookingId, hotel_id: hotelId }, data });
    }

    /**
     * Update Booking Status
     * @param bookingId 
     * @param status 
     * @param note 
     * @returns 
     */
    async updateBookingStatus(bookingId: number, status: string, note?: string) {
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
    async getBookingTransferHistory(bookingId: number) {
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
}
