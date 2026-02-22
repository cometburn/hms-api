import { Booking } from "@prisma/client";
import {
    getBookings,
    countBookings,
    createBookingRepository,
    updateBookingRepository,
    deleteBookingRepository,
    findBookingById
} from "@/repositories/booking.repository";
import { RequestParams } from "@/interfaces";
import { compareObjects } from "@/utils/object.utils";
import { BadRequestError, NotFoundError } from "@/helpers/error.helper";
import { BOOKING_EDITABLE_FIELDS, BOOKING_EDIT_WINDOW_MINUTES } from "@/constants";



/**
 * Get all Bookings service
 * @param hotelId
 * @param page
 * @param limit
 * @param search
 * @returns list of bookings
 */
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


/**
 * Create Booking service
 * @param data
 * @returns created Booking
 */
export const createBookingService = async (data: Booking) => {
    return await createBookingRepository(data);
};


/**
 * Update Booking service
 * @param hotelId
 * @param id
 * @param data
 * @returns updated Booking
 */
export const updateBookingService = async (hotelId: number, bookingId: number, data: any) => {
    const booking = await findBookingById(hotelId, bookingId);
    if (!booking) throw new NotFoundError("Booking not found");

    const payload = {
        ...data,
        start_datetime: new Date(data.start_datetime),
        end_datetime: new Date(data.end_datetime),
    };

    switch (payload.status) {
        case "check_out":
            break;
        case "cancelled":
            const changes = compareObjects(booking, payload, ["room_rate_id", "start_datetime", "end_datetime", "total_price", "extra_person"]);
            const hasChanges = Object.keys(changes).length > 0;

            if (hasChanges) {
                const diffMinutes = Math.floor((Date.now() - new Date(booking.start_datetime).getTime()) / 60000);
                if (diffMinutes > BOOKING_EDIT_WINDOW_MINUTES) {
                    throw new BadRequestError(`Booking start time is over ${BOOKING_EDIT_WINDOW_MINUTES} minutes`);
                }
            }
            break;
    }



    return await updateBookingRepository(hotelId, bookingId, payload);
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


/**
 * Get Booking by Id service
 * @param hotelId
 * @param bookingId
 * @returns Booking
 */
export const getBookingByIdService = async (hotelId: number, bookingId: number) => {
    return await findBookingById(hotelId, bookingId);
};