import { NextFunction, Request, Response } from "express";
import {
    getBookingAddonService,
    createBookingAddonService,
    deleteBookingAddonService
} from "@/services/bookingAddon.service";
import { socketService } from "@/sockets/socket.service";
import { NotFoundError } from "@/helpers/error.helper";
import { deleteRoomService } from "@/services/room.service";

/**
 * Gets all booking addons
 * @param req
 * @param res
 */
export const getBookingAddons = async (req: Request, res: Response) => {
    const result = await getBookingAddonService({
        bookingId: Number(req.params.bookingId),
    });

    return res.json(result);
};


/**
 * Creates a booking addon
 * @param req
 * @param res
 */
export const createBookingAddon = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const data = req.body;

        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const result = await createBookingAddonService({
            ...data,
            user_id: user.id,
        });

        socketService.emitToHotelUsers(`hotel_${user.default_hotel.id}`, "addon_created", result);

        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * Deletes booking addon
 * @param req
 * @param res
 */
export const deleteBookingAddon = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const { bookingId } = req.params;

        if (!user.default_hotel) {
            throw new NotFoundError("User hotel missing");
        }

        await deleteBookingAddonService(Number(bookingId));

        return res.status(200).json({
            message: "Booking addon deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};
