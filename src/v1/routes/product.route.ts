import { Router } from "express";
import { ProductController } from "@/controllers/product.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { productSchema } from "@/interfaces/types/product.types";

const productRoute = Router();
const productController = new ProductController();

productRoute.get("/", productController.getProducts);
productRoute.post("/", withValidation(productSchema, productController.createProduct));
productRoute.put("/:id", withValidation(productSchema.partial(), productController.updateProduct));
productRoute.delete("/:id", productController.deleteProduct);

export default productRoute;
