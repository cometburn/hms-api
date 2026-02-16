import { NextFunction, Request, Response } from "express";
import { socketService } from "@/sockets/socket.service";
import { createBookingService } from "@/services/booking.service";
import { NotFoundError } from "@/helpers/error.helper";

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
