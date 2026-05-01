import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "@/helpers/error.helper";

import * as ProductMovementService from "@/services/productMovement.service";

/**
 * Gets all product movements
 * @param req
 * @param res
 */
export const getProductMovements = async (req: Request, res: Response) => {
    const user = req.user!;
    if (!user.default_hotel) throw new NotFoundError("User hotel missing");

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const safePage = !isNaN(page) ? page : 1;
    const safeLimit = !isNaN(limit) ? limit : 10;
    const search = (req.query.search as string) || "";
    const type = (req.query.type as string) || "";

    const result = await ProductMovementService.getProductMovements({
        hotelId: user.default_hotel.id,
        page: safePage,
        limit: safeLimit,
        search,
        type
    });

    return res.json(result);
};

/**
 * Creates a product movement
 * @param req
 * @param res
 */
export const createProductMovement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const data = req.body;

        console.log('user', user)

        if (!user.default_hotel) throw new NotFoundError("User hotel missing");


        const result = await ProductMovementService.createProductMovement(
            user.id,
            data
        );

        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * Updates a product movement
 * @param req
 * @param res
 * @returns
 */
export const updateProductMovement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const data = req.body;
        const { id } = req.params;

        if (!user.default_hotel) {
            throw new NotFoundError("User hotel missing");
        }

        const result = await ProductMovementService.updateProductMovement(
            user.default_hotel.id,
            Number(id),
            user.id,
            data
        );

        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};