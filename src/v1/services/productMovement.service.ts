import { ProductMovementRepository } from "@/repositories/productMovement.repository";
import { Product, ProductRequestParams } from "@/interfaces/types/product.types";

export class ProductMovementService {
    private productMovementRepository: ProductMovementRepository;
    constructor() {
        this.productMovementRepository = new ProductMovementRepository();
    }
    /**
     * Gets all product movements
     * @param hotelId
     * @param page
     * @param limit
     * @param search
     * @returns
     */
    getProductMovementsService = async ({
        hotelId,
        page,
        limit,
        search,
        category,
        withStock,
    }: ProductRequestParams) => {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.productMovementRepository.getProductMovements(hotelId, search, category, withStock, skip, limit),
            this.productMovementRepository.countProductMovements(hotelId, search, category, withStock),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    };

    /**
     * Creates a product movement service
     * @param hotelId
     * @param data
     * @returns created product movement
     */
    createProductMovementService = async (hotelId: number, data: Product) => {
        return await this.productMovementRepository.createProductMovementRepository({
            ...data,
            hotel_id: hotelId,
        });
    };

    /**
     * Updates a product movement service
     * @param hotelId
     * @param id
     * @param data
     * @returns updated product movement
     */
    updateProductMovementService = async (hotelId: number, id: number, userId: number, data: Partial<Product>) => {
        return await this.productMovementRepository.updateProductMovementRepository(hotelId, id, userId, data);
    };
}
