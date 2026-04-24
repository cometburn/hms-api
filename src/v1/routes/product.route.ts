import { Router } from "express";
import { ProductController } from "@/controllers/product.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { productSchema } from "@/interfaces/types/product.types";

const productRoute = Router();
const productController = new ProductController();

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
productRoute.get("/", productController.getProducts);

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
productRoute.post("/", withValidation(productSchema, productController.createProduct));

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
productRoute.put("/:id", withValidation(productSchema.partial(), productController.updateProduct));

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
productRoute.delete("/:id", productController.deleteProduct);

export default productRoute;
