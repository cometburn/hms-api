import { NextFunction, Request, Response } from "express";
import { RoomTypeService } from "@/services/roomType.service";
import { NotFoundError } from "@/helpers/error.helper";

export class RoomTypeController {
    private roomTypeService: RoomTypeService;
    constructor() {
        this.roomTypeService = new RoomTypeService();

        this.getAllRoomTypes = this.getAllRoomTypes.bind(this);
        this.createRoomType = this.createRoomType.bind(this);
        this.updateRoomType = this.updateRoomType.bind(this);
        this.deleteRoomType = this.deleteRoomType.bind(this);
    }

    /**
     * Gets all room types using the user default hotel
     * @param req
     * @param res
     */
    getAllRoomTypes = async (req: Request, res: Response) => {
        const user = req.user!;
        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const search = (req.query.search as string) || "";

        // Allow 0 to pass through; default only if missing or invalid
        const safePage = !isNaN(page) ? page : 1;
        const safeLimit = !isNaN(limit) ? limit : 10;

        const result = await this.roomTypeService.getAllRoomTypes({
            hotelId: user.default_hotel.id,
            page: safePage,
            limit: safeLimit,
            search,
        });

        return res.json(result);
    };

    /**
     * Creates a room type using user default hotel
     * @param req
     * @param res
     */
    createRoomType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const data = req.body;

            if (!user.default_hotel) throw new NotFoundError("User hotel missing");

            const result = await this.roomTypeService.createRoomType(user.default_hotel.id, data);

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
    updateRoomType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const data = req.body;
            const { id } = req.params;

            if (!user.default_hotel) {
                throw new NotFoundError("User hotel missing");
            }

            const result = await this.roomTypeService.updateRoomType(
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
     * Deletes room type
     * @param req
     * @param res
     */
    deleteRoomType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const { id } = req.params;

            if (!user.default_hotel) {
                throw new NotFoundError("User hotel missing");
            }

            await this.roomTypeService.deleteRoomType(user.default_hotel.id, Number(id));

            return res.status(200).json({
                message: "Room type deleted successfully",
            });
        } catch (err) {
            next(err);
        }
    };
}
