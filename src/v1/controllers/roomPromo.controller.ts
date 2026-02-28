import { NextFunction, Request, Response } from "express";
import { RoomPromoService } from "@/services/roomPromo.service";
import { NotFoundError } from "@/helpers/error.helper";

export class RoomPromoController {
    private roomPromoService: RoomPromoService;
    constructor() {
        this.roomPromoService = new RoomPromoService();

        this.getAllRoomPromos = this.getAllRoomPromos.bind(this);
        this.createRoomPromo = this.createRoomPromo.bind(this);
        this.updateRoomPromo = this.updateRoomPromo.bind(this);
        this.deleteRoomPromo = this.deleteRoomPromo.bind(this);
    }

    /**
     * Gets all room Promos using the user default hotel
     * @param req
     * @param res
     */
    getAllRoomPromos = async (req: Request, res: Response) => {
        const user = req.user!;
        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = (req.query.search as string) || "";

        // Call service
        const result = await this.roomPromoService.getAllRoomPromos({
            hotelId: user.default_hotel.id,
            page,
            limit,
            search,
        });

        return res.json(result);
    };

    /**
     * Creates a room Promo using user default hotel
     * @param req
     * @param res
     */
    createRoomPromo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const data = req.body;

            if (!user.default_hotel) throw new NotFoundError("User hotel missing");

            const result = await this.roomPromoService.createRoomPromo(user.default_hotel.id, data);

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
    updateRoomPromo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const data = req.body;
            const { id } = req.params;

            if (!user.default_hotel) {
                throw new NotFoundError("User hotel missing");
            }

            const result = await this.roomPromoService.updateRoomPromo(
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
     * Deletes room Promo
     * @param req
     * @param res
     */
    deleteRoomPromo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const { id } = req.params;

            if (!user.default_hotel) {
                throw new NotFoundError("User hotel missing");
            }

            await this.roomPromoService.deleteRoomPromo(user.default_hotel.id, Number(id));

            return res.status(200).json({
                message: "Room Promo deleted successfully",
            });
        } catch (err) {
            next(err);
        }
    };
}
