import { Request, Response } from "express";
import { HotelService } from "@/services/hotel.service";

export class HotelController {
    private hotelService: HotelService;

    constructor() {
        this.hotelService = new HotelService();
    }

    /**
     * Create Hotel
     * @param req
     * @param res
     * @returns
     */
    createHotel = async (req: Request, res: Response) => {
        const user = req.user!;
        const data = req.body;

        const hotel = await this.hotelService.createHotelService(user.id, data);

        return res.status(201).json(hotel);
    };
}
