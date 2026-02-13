import { NextFunction, Request, Response } from "express";
import { getDashboardRoomsService } from "@/services/dashboard.service";
import { NotFoundError } from "@/helpers/error.helper";

export const getDashboardRooms = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const result = await getDashboardRoomsService(
            user.default_hotel.id,
        );

        return res.status(200).json({
            message: "Dashboard rooms fetched successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
