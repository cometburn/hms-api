import { Router } from "express";
import { ProductMovementController } from "@/controllers/productMovement.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { productMovementSchema } from "@/interfaces/types/productMovement.types";

const productMovementRoute = Router();
const productMovementController = new ProductMovementController();

productMovementRoute.get("/", productMovementController.getProductMovements);
productMovementRoute.post("/", withValidation(productMovementSchema, productMovementController.createProductMovement));

export default productMovementRoute;
