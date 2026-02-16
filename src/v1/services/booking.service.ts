import { Booking } from "@prisma/client";
import {
    getBookings,
    countBookings,
    createBookingRepository,
    updateBookingRepository,
    deleteBookingRepository,
} from "@/repositories/booking.repository";
import { RequestParams } from "@/interfaces";

export const getAllBookingsService = async ({
    hotelId,
    page,
    limit,
    search,
}: RequestParams) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        getBookings(hotelId, search, skip, limit),
        countBookings(hotelId, search),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages,
        },
    };
};

export const createBookingService = async (data: Booking) => {
    return await createBookingRepository(data);
};

export const updateBookingService = async (
    hotelId: number,
    id: number,
    data: Partial<Booking>
) => {
    return await updateBookingRepository(hotelId, id, data);
};

/**
 * Delete Booking type service
 * @param hotelId
 * @param id
 * @returns deleted Booking type
 */
export const deleteBookingService = async (hotelId: number, id: number) => {
    return await deleteBookingRepository(hotelId, id);
};
