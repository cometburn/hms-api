import { NextFunction, Request, Response } from "express";
import { InventoryService } from "@/services/inventory.service";
import { NotFoundError } from "@/helpers/error.helper";

export class InventoryController {
    private inventoryService: InventoryService;

    constructor() {
        this.inventoryService = new InventoryService();

        this.getInventories = this.getInventories.bind(this);
    }

    /**
     * Gets all rooms using the user default hotel
     * @param req
     * @param res
     */
    getInventories = async (req: Request, res: Response) => {
        const user = req.user!;
        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const safePage = !isNaN(page) ? page : 1;
        const safeLimit = !isNaN(limit) ? limit : 10;
        const search = (req.query.search as string) || "";
        const category = (req.query.category as string) || "";

        const result = await this.inventoryService.getInventories({
            hotelId: user.default_hotel.id,
            page: safePage,
            limit: safeLimit,
            search,
            category,
        });

        return res.json(result);
    };
}
