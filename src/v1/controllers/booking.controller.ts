import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "@/helpers/error.helper";
import { socketService } from "@/sockets/socket.service";

import * as BookingService from "@/services/booking.service";
import { createOrder } from "@/services/order.service";
import { sendMail } from "@/helpers/mailer.helper";
import { getUserById, getUserHotels } from "@/repositories/user.repository";
import { getRoomById } from "@/repositories/room.repository";
import { User } from "@prisma/client";
import { formatDate } from "@/utils/date.utils";

/**
 * Get All Bookings
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const search = (req.query.search as string) || "";
        const safePage = !isNaN(page) ? page : 1;
        const safeLimit = !isNaN(limit) ? limit : 10;

        const result = await BookingService.getAllBookings(user.default_hotel.id, search, safePage, safeLimit);

        return res.json(result);
    } catch (err) {
        next(err);
    }
}

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


        let owner

        if (user.default_hotel.owner_id) {
            owner = await getUserById(user.default_hotel.owner_id)
        }

        sendMail({
            to: owner ? owner.email : user.email,
            type: 'check_in',
            type_label: 'Check In',
            hotel: user.default_hotel.name,
            room_name: booking.room?.name,
            room_type: booking.room?.room_type.name,
            room_rate: booking.room_rate.name,
            extra_person: booking.extra_person,
            start: formatDate(booking?.start_datetime, "MM/DD/YYYY hh:mm A"),
            end: formatDate(booking?.end_datetime, "MM/DD/YYYY hh:mm A"),
        })

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

        const hotelId = user.default_hotel.id;

        const booking = await BookingService.updateBooking(hotelId, user.id, bookingId, data);

        if (data.status === "check_out") {
            socketService.emitToHotelUsers(`hotel_${hotelId}`, "check_out", booking);

            let owner

            if (user.default_hotel.owner_id) {
                owner = await getUserById(user.default_hotel.owner_id)
            }

            sendMail({
                to: owner ? owner.email : user.email,
                type: 'check_out',
                type_label: 'Check Out',
                hotel: user.default_hotel.name,
                room_name: booking.room?.name,
                room_type: booking.room?.room_type.name,
                room_rate: booking.room_rate.name,
                extra_person: booking.extra_person,
                start: formatDate(booking?.start_datetime, "MM/DD/YYYY hh:mm A"),
                end: formatDate(booking?.end_datetime, "MM/DD/YYYY hh:mm A"),
                payment_type: booking.payment_type,
                payment_status: booking.payment_status,
            })
        }

        return res.status(200).json({
            message: "Booking updated successfully",
            data: booking,
        });
    } catch (err) {
        next(err);
    }
}