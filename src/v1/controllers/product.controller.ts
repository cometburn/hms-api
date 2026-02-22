import { NextFunction, Request, Response } from "express";
import {
    getProductsService,
    createProductService,
    updateProductService,
    deleteProductService,
} from "@/services/product.service";
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

    const result = await getProductsService({
        hotelId: user.default_hotel.id,
        page: safePage,
        limit: safeLimit,
        search,
        category
    });

    return res.json(result);
};

/**
 * Creates a product  using user default hotel
 * @param req
 * @param res
 */
export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const data = req.body;

        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const result = await createProductService(user.default_hotel.id, data);

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
export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const data = req.body;
        const { id } = req.params;

        if (!user.default_hotel) {
            throw new NotFoundError("User hotel missing");
        }

        const result = await updateProductService(
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
 * Deletes product 
 * @param req
 * @param res
 */
export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const { id } = req.params;

        if (!user.default_hotel) {
            throw new NotFoundError("User hotel missing");
        }

        await deleteProductService(user.default_hotel.id, Number(id));

        return res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};
