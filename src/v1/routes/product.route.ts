import { Router } from "express";
import { withValidation } from "@/middlewares/validation.middleware";

import { getProducts, createProduct, updateProduct, deleteProduct } from "@/controllers/product.controller";
import { productSchema } from "@/interfaces/types/product.types";

const productRoute = Router();

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
productRoute.get("/", getProducts);

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
productRoute.post("/", withValidation(productSchema, createProduct));

/**
 * @openapi
 * /api/v1/products/:id:
 *   put:
 *     summary: Update a product
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
productRoute.put("/:id", withValidation(productSchema.partial(), updateProduct));

/**
 * @openapi
 * /api/v1/products/:id:
 *   delete:
 *     summary: Delete a product
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
productRoute.delete("/:id", deleteProduct);

export default productRoute;
