import { NextFunction, Request, Response } from "express";
import { RoomService } from "@/services/room.service";
import { NotFoundError } from "@/helpers/error.helper";

export class RoomController {
    private roomService: RoomService;

    constructor() {
        this.roomService = new RoomService();
        this.getAllRooms = this.getAllRooms.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.updateRoom = this.updateRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
    }

    /**
     * Gets all rooms using the user default hotel
     * @param req
     * @param res
     */
    getAllRooms = async (req: Request, res: Response) => {
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
            const result = await this.roomService.getAvailableRoomsByRoomTypeId(user.default_hotel.id, Number(roomTypeId));
            return res.json(result);
        }

        const result = await this.roomService.getAllRooms({
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
    createRoom = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const data = req.body;

            if (!user.default_hotel) throw new NotFoundError("User hotel missing");

            const result = await this.roomService.createRoom(user.default_hotel.id, data);

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
    updateRoom = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const data = req.body;
            const { id } = req.params;

            if (!user.default_hotel) {
                throw new NotFoundError("User hotel missing");
            }

            const result = await this.roomService.updateRoom(
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
    deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const { id } = req.params;

            if (!user.default_hotel) {
                throw new NotFoundError("User hotel missing");
            }

            await this.roomService.deleteRoom(user.default_hotel.id, Number(id));

            return res.status(200).json({
                message: "Room deleted successfully",
            });
        } catch (err) {
            next(err);
        }
    };
}
