import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "@/helpers/error.helper";
import { socketService } from "@/sockets/socket.service";

import * as BookingService from "@/services/booking.service";
import { createOrder } from "@/services/order.service";

/**
 * Get Booking By Id
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { bookingId } = req.params;
        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const result = await BookingService.findBookingById(
            user.default_hotel.id,
            Number(bookingId)
        );

        return res.json(result);
    } catch (err) {
        next(err);
    }
}

/**
 * Create Booking
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const data = req.body;

        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const booking = await BookingService.createBooking({
            ...data,
            hotel_id: user.default_hotel.id,
            user_id: user.id,
        });

        // create order
        await createOrder(
            user.default_hotel.id,
            user.id,
            {
                hotel_id: user.default_hotel.id,
                booking_id: booking.id,
                total_price: 0,
                status: "pending",
            }
        );

        socketService.emitToHotelUsers(
            `hotel_${user.default_hotel.id}`,
            "check_in",
            booking
        );

        return res.status(201).json({
            message: "Booking created successfully",
            data: booking,
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Update Booking
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const updateBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const data = req.body;
        const bookingId = Number(data.id);

        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const hotelId = user.default_hotel.id; // destructure once after the check

        const result = await BookingService.updateBooking(hotelId, user.id, bookingId, data);

        if (data.status === "check_out") {
            socketService.emitToHotelUsers(`hotel_${hotelId}`, "check_out", result);
        }

        return res.status(200).json({
            message: "Booking updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
}