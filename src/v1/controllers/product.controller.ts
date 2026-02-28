import { NextFunction, Request, Response } from "express";
import { ProductService } from "@/services/product.service";
import { NotFoundError } from "@/helpers/error.helper";

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();

        this.getProducts = this.getProducts.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    /**
     * Gets all rooms using the user default hotel
     * @param req
     * @param res
     */
    getProducts = async (req: Request, res: Response) => {
        const user = req.user!;
        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const safePage = !isNaN(page) ? page : 1;
        const safeLimit = !isNaN(limit) ? limit : 10;
        const search = (req.query.search as string) || "";
        const category = (req.query.category as string) || "";

        const result = await this.productService.getProductsService({
            hotelId: user.default_hotel.id,
            page: safePage,
            limit: safeLimit,
            search,
            category,
        });

        return res.json(result);
    };

    /**
     * Creates a product  using user default hotel
     * @param req
     * @param res
     */
    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const data = req.body;

            if (!user.default_hotel) throw new NotFoundError("User hotel missing");

            const result = await this.productService.createProductService(
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
    updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const data = req.body;
            const { id } = req.params;

            if (!user.default_hotel) {
                throw new NotFoundError("User hotel missing");
            }

            const result = await this.productService.updateProductService(
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
    deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const { id } = req.params;

            if (!user.default_hotel) {
                throw new NotFoundError("User hotel missing");
            }

            await this.productService.deleteProductService(user.default_hotel.id, Number(id));

            return res.status(200).json({
                message: "Product deleted successfully",
            });
        } catch (err) {
            next(err);
        }
    };
}
