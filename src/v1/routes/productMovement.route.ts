import { Router } from "express";
import { withValidation } from "@/middlewares/validation.middleware";
import { productMovementSchema } from "@/interfaces/types/productMovement.types";

import { getProductMovements, createProductMovement, updateProductMovement } from "@/controllers/productMovement.controller";

const productMovementRoute = Router();

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
productMovementRoute.get("/", getProductMovements);

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
productMovementRoute.post("/", withValidation(productMovementSchema.omit({ user_id: true }), createProductMovement));

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
productMovementRoute.put("/:id", withValidation(productMovementSchema.partial(), updateProductMovement));

export default productMovementRoute;
