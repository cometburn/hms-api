import { Router } from "express";
import { ProductMovementController } from "@/controllers/productMovement.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { productMovementSchema } from "@/interfaces/types/productMovement.types";

const productMovementRoute = Router();
const productMovementController = new ProductMovementController();

/**
 * @openapi
 * /api/v1/product-movements:
 *   get:
 *     summary: Get all product movements
 *     tags:
 *       - Product Movements
 *     responses:
 *       200:
 *         description: Product movements fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
productMovementRoute.get("/", productMovementController.getProductMovements);

/**
 * @openapi
 * /api/v1/product-movements:
 *   post:
 *     summary: Create a new product movement
 *     tags:
 *       - Product Movements
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Product movement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
productMovementRoute.post("/", withValidation(productMovementSchema, productMovementController.createProductMovement));

/**
 * @openapi
 * /api/v1/product-movements/:id:
 *   put:
 *     summary: Update a product movement
 *     tags:
 *       - Product Movements
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Product movement updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
productMovementRoute.put("/:id", withValidation(productMovementSchema.partial(), productMovementController.updateProductMovement));

export default productMovementRoute;
