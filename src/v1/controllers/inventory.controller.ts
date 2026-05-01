import { NextFunction, Request, Response } from "express";
import { getInventories as getInventoriesService } from "@/services/inventory.service";
import { NotFoundError } from "@/helpers/error.helper";

/**
 * Gets all rooms using the user default hotel
 * @param req
 * @param res
 */
export const getInventories = async (req: Request, res: Response) => {
    const user = req.user!;
    if (!user.default_hotel) throw new NotFoundError("User hotel missing");

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const safePage = !isNaN(page) ? page : 1;
    const safeLimit = !isNaN(limit) ? limit : 10;
    const search = (req.query.search as string) || "";
    const category = (req.query.category as string) || "";

    const result = await getInventoriesService({
        hotelId: user.default_hotel.id,
        page: safePage,
        limit: safeLimit,
        search,
        category,
    });

    return res.json(result);
};