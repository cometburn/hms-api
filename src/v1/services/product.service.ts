import { ProductRepository } from "@/repositories/product.repository";
import { Product, ProductRequestParams } from "@/interfaces/types/product.types";

export class ProductService {
    private productRepository: ProductRepository;
    constructor() {
        this.productRepository = new ProductRepository();
    }
    /**
     * Gets all products
     * @param hotelId
     * @param page
     * @param limit
     * @param search
     * @returns
     */
    getProductsService = async ({
        hotelId,
        page,
        limit,
        search,
        category,
        withStock,
    }: ProductRequestParams) => {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.productRepository.getProducts(hotelId, search, category, withStock, skip, limit),
            this.productRepository.countProducts(hotelId, search, category, withStock),
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
     * Creates a product
     * @param hotelId
     * @param data
     * @returns created product
     */
    createProductService = async (hotelId: number, data: Product) => {
        return await this.productRepository.createProductRepository({
            ...data,
            hotel_id: hotelId,
        });
    };

    /**
     * Updates a product
     * @param hotelId
     * @param id
     * @param data
     * @returns updated product
     */
    updateProductService = async (hotelId: number, id: number, userId: number, data: Partial<Product>) => {
        return await this.productRepository.updateProductRepository(hotelId, id, userId, data);
    };

    /**
     * Delete product service
     * @param hotelId
     * @param id
     * @returns deleted product
     */
    deleteProductService = async (hotelId: number, id: number) => {
        return await this.productRepository.deleteProductRepository(hotelId, id);
    };
}
