import { Router } from "express";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "@/controllers/product.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { productSchema } from "@/interfaces/types/product.types";

const productRoute = Router();

productRoute.get("/", getProducts);
productRoute.post("/", withValidation(productSchema, createProduct));
productRoute.put("/:id", withValidation(productSchema.partial(), updateProduct));
productRoute.delete("/:id", deleteProduct);

export default productRoute;
