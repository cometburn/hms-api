import { NextFunction, Request, Response } from "express";
import {
    createRoomService,
    getAllRoomsService,
    updateRoomService,
    deleteRoomService,
} from "@/services/room.service";
import { NotFoundError } from "@/helpers/error.helper";

/**
 * Gets all rooms using the user default hotel
 * @param req
 * @param res
 */
export const getAllRooms = async (req: Request, res: Response) => {
    const user = req.user!;
    if (!user.default_hotel) throw new NotFoundError("User hotel missing");

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const search = (req.query.search as string) || "";

    // Allow 0 to pass through; default only if missing or invalid
    const safePage = !isNaN(page) ? page : 1;
    const safeLimit = !isNaN(limit) ? limit : 10;

    const result = await getAllRoomsService({
        hotelId: user.default_hotel.id,
        page: safePage,
        limit: safeLimit,
        search,
    });

    return res.json(result);
};

/**
 * Creates a room  using user default hotel
 * @param req
 * @param res
 */
export const createRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const data = req.body;

        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const result = await createRoomService(user.default_hotel.id, data);

        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const updateRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const data = req.body;
        const { id } = req.params;

        if (!user.default_hotel) {
            throw new NotFoundError("User hotel missing");
        }

        const result = await updateRoomService(
            user.default_hotel.id,
            Number(id),
            data
        );

        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * Deletes room 
 * @param req
 * @param res
 */
export const deleteRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const { id } = req.params;

        if (!user.default_hotel) {
            throw new NotFoundError("User hotel missing");
        }

        await deleteRoomService(user.default_hotel.id, Number(id));

        return res.status(200).json({
            message: "Room deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};
