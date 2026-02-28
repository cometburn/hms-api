import { Booking } from "@prisma/client";
import { BookingRepository } from "@/repositories/booking.repository";
import { RequestParams } from "@/interfaces";
import { compareObjects } from "@/utils/object.utils";
import { BadRequestError, NotFoundError } from "@/helpers/error.helper";
import { BOOKING_EDIT_WINDOW_MINUTES } from "@/constants";

export class BookingService {
    private bookingRepo: BookingRepository;

    constructor() {
        this.bookingRepo = new BookingRepository();
    }

    /**
     * Get all Bookings service
     * @param hotelId
     * @param search
     * @param page
     * @param limit
     * @returns
     */
    async getAllBookings(hotelId: number, search: string, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.bookingRepo.getBookings(hotelId, search, skip, limit),
            this.bookingRepo.countBookings(hotelId, search),
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
    }

    /**
     * Create Booking service
     * @param data
     * @returns
     */
    async createBooking(data: Booking) {
        return await this.bookingRepo.createBooking(data);
    }

    /**
     * Update Booking service
     * @param hotelId
     * @param bookingId
     * @param data
     * @returns
     */
    async updateBooking(hotelId: number, bookingId: number, data: any) {
        const booking = await this.bookingRepo.findBookingById(hotelId, bookingId);
        if (!booking) throw new NotFoundError("Booking not found");

        const payload = {
            ...data,
            start_datetime: new Date(data.start_datetime),
            end_datetime: new Date(data.end_datetime),
        };

        switch (payload.status) {
            case "cancelled":
                const changes = compareObjects(booking, payload, [
                    "room_rate_id",
                    "start_datetime",
                    "end_datetime",
                    "total_price",
                    "extra_person",
                ]);
                const hasChanges = Object.keys(changes).length > 0;

                if (hasChanges) {
                    const diffMinutes = Math.floor(
                        (Date.now() - new Date(booking.start_datetime).getTime()) / 60000
                    );
                    if (diffMinutes > BOOKING_EDIT_WINDOW_MINUTES) {
                        throw new BadRequestError(
                            `Booking start time is over ${BOOKING_EDIT_WINDOW_MINUTES} minutes`
                        );
                    }
                }
                break;
        }

        return await this.bookingRepo.updateBookingById(hotelId, bookingId, payload);
    }

    /**
     * Delete Booking service
     * @param hotelId
     * @param bookingId
     * @returns
     */
    async deleteBooking(hotelId: number, bookingId: number) {
        return await this.bookingRepo.deleteBooking(hotelId, bookingId);
    }

    /**
     * Find Booking by Id service
     * @param hotelId
     * @param bookingId
     * @returns
     */
    async findBookingById(hotelId: number, bookingId: number) {
        return await this.bookingRepo.findBookingById(hotelId, bookingId);
    }

    /**
     * Update Booking by Id service
     * @param hotelId
     * @param bookingId
     * @param data
     * @returns
     */
    async updateBookingById(hotelId: number, bookingId: number, data: any) {
        return await this.bookingRepo.updateBookingById(hotelId, bookingId, data);
    }
}
