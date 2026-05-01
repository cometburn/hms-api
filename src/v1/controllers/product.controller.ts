import { NextFunction, Request, Response } from "express";
import * as  ProductService from "@/services/product.service";
import { NotFoundError } from "@/helpers/error.helper";

/**
 * Gets all rooms using the user default hotel
 * @param req
 * @param res
 */
export const getProducts = async (req: Request, res: Response) => {
    const user = req.user!;
    if (!user.default_hotel) throw new NotFoundError("User hotel missing");

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const safePage = !isNaN(page) ? page : 1;
    const safeLimit = !isNaN(limit) ? limit : 10;
    const search = (req.query.search as string) || "";
    const category = (req.query.category as string) || "";
    const withStock = (req.query.stock as string) === "true";

    const result = await ProductService.getProducts({
        hotelId: user.default_hotel.id,
        page: safePage,
        limit: safeLimit,
        search,
        category,
        withStock
    });

    return res.json(result);
};

/**
 * Creates a product  using user default hotel
 * @param req
 * @param res
 */
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const data = req.body;

        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const result = await ProductService.createProduct(
            user.default_hotel.id,
            data
        );

        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * Updates a product
 * @param req
 * @param res
 * @returns
 */
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const data = req.body;
        const { id } = req.params;

        if (!user.default_hotel) {
            throw new NotFoundError("User hotel missing");
        }

        const result = await ProductService.updateProduct(
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

/**
 * Deletes product
 * @param req
 * @param res
 */
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { id } = req.params;

        if (!user.default_hotel) {
            throw new NotFoundError("User hotel missing");
        }

        await ProductService.deleteProduct(user.default_hotel.id, Number(id));

        return res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};