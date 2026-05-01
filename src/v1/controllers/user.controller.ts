import { NextFunction, Request, Response } from "express";
import { switchUserHotel } from "@/services/user.service";
import { NotFoundError } from "@/helpers/error.helper";

/**
 * Switches user default hotel
 * @param req
 * @param res
 */
export const switchDefaultHotel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const hotelId = Number(req.params.hotel_id);

        if (!hotelId) throw new NotFoundError("User hotel missing");

        const hotel = await switchUserHotel(user.id, hotelId);

        return res.status(201).json(hotel);
    } catch (err) {
        next(err);
    }
};