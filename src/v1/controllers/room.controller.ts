import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "@/helpers/error.helper";

import * as RoomService from "@/services/room.service";

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
    const roomTypeId = (req.query.room_type_id as string) || "";

    // Allow 0 to pass through; default only if missing or invalid
    const safePage = !isNaN(page) ? page : 1;
    const safeLimit = !isNaN(limit) ? limit : 10;


    if (roomTypeId) {
        const result = await RoomService.getAvailableRoomsByRoomTypeId(user.default_hotel.id, Number(roomTypeId));
        return res.json(result);
    }

    const result = await RoomService.getAllRooms({
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
export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const data = req.body;

        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const result = await RoomService.createRoom(user.default_hotel.id, data);

        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * constructor() {
 * this.get}
 *
 * @param req
 * @param res
 * @returns
 */
export const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const data = req.body;
        const { id } = req.params;

        if (!user.default_hotel) {
            throw new NotFoundError("User hotel missing");
        }

        const result = await RoomService.updateRoom(
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
export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { id } = req.params;

        if (!user.default_hotel) {
            throw new NotFoundError("User hotel missing");
        }

        await RoomService.deleteRoom(user.default_hotel.id, Number(id));

        return res.status(200).json({
            message: "Room deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};
