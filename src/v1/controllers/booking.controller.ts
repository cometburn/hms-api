import { NextFunction, Request, Response } from "express";
import { socketService } from "@/sockets/socket.service";
import { getBookingByIdService, createBookingService, updateBookingService } from "@/services/booking.service";
import { NotFoundError } from "@/helpers/error.helper";


export const getBookingById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const { bookingId } = req.params;
        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const result = await getBookingByIdService(
            user.default_hotel.id,
            Number(bookingId)
        );

        return res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * Create Booking
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const createBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const data = req.body;


        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const result = await createBookingService({
            ...data,
            hotel_id: user.default_hotel.id,
            user_id: user.id,
        });

        socketService.emitToHotelUsers(`hotel_${user.default_hotel.id}`, "check_in", result);

        return res.status(201).json({
            message: "Booking created successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Update Booking
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const updateBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const result = await updateBookingService(user.default_hotel.id, Number(req.params.bookingId), req.body);
        socketService.emitToHotelUsers(`hotel_${user.default_hotel.id}`, "check_out", result);

        return res.status(200).json({ message: "Booking updated successfully", data: result });
    } catch (err) {
        next(err);
    }
};

