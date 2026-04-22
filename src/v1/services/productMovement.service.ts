import { ProductMovementRepository } from "@/repositories/productMovement.repository";
import { ProductMovement, ProductMovementRequestParams } from "@/interfaces/types/productMovement.types";

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
        type,
    }: ProductMovementRequestParams) => {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.productMovementRepository.getProductMovements(hotelId, search, type, skip, limit),
            this.productMovementRepository.countProductMovements(hotelId, search, type),
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
    createProductMovementService = async (userId: number, data: ProductMovement) => {
        return await this.productMovementRepository.createProductMovementRepository({
            ...data,
            user_id: userId,
        });
    };
}
