import { NextFunction, Request, Response } from "express";
import { ProductMovementService } from "@/services/productMovement.service";
import { NotFoundError } from "@/helpers/error.helper";

export class ProductMovementController {
    private productMovementService: ProductMovementService;

    constructor() {
        this.productMovementService = new ProductMovementService();

        this.getProductMovements = this.getProductMovements.bind(this);
        this.createProductMovement = this.createProductMovement.bind(this);
        this.updateProductMovement = this.updateProductMovement.bind(this);
    }

    /**
     * Gets all product movements
     * @param req
     * @param res
     */
    getProductMovements = async (req: Request, res: Response) => {
        const user = req.user!;
        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const safePage = !isNaN(page) ? page : 1;
        const safeLimit = !isNaN(limit) ? limit : 10;
        const search = (req.query.search as string) || "";
        const type = (req.query.type as string) || "";

        const result = await this.productMovementService.getProductMovementsService({
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
    createProductMovement = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const data = req.body;

            console.log('user', user)

            if (!user.default_hotel) throw new NotFoundError("User hotel missing");


            const result = await this.productMovementService.createProductMovementService(
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
    updateProductMovement = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const data = req.body;
            const { id } = req.params;

            if (!user.default_hotel) {
                throw new NotFoundError("User hotel missing");
            }

            const result = await this.productMovementService.updateProductMovementService(
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
}
