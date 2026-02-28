import { NextFunction, Request, Response } from "express";
import { UserService } from "@/services/user.service";
import { NotFoundError } from "@/helpers/error.helper";

export class UserController {
    private userService: UserService;
    constructor() {
        this.userService = new UserService();

        this.switchDefaultHotel = this.switchDefaultHotel.bind(this);
    }

    /**
     * Switches user default hotel
     * @param req
     * @param res
     */
    switchDefaultHotel = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const hotelId = Number(req.body.hotel_id);

            if (!hotelId) throw new NotFoundError("User hotel missing");

            const hotel = await this.userService.switchUserHotel(user.id, hotelId);

            return res.status(201).json(hotel);
        } catch (err) {
            next(err);
        }
    };
}
