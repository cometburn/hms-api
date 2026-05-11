import { Router } from "express";
import { withValidation } from "@/middlewares/validation.middleware";

import { getOrders, createOrder, updateOrder, deleteOrder } from "@/controllers/order.controller";
import { directOrderSchema } from "@/interfaces/types/order.types";

const orderRoute = Router();

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
orderRoute.get("/", getOrders);

/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
orderRoute.post("/", withValidation(directOrderSchema.omit({ id: true, hotel_id: true }), createOrder));

/**
 * @openapi
 * /api/v1/orders/:id:
 *   put:
 *     summary: Update an order
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
orderRoute.put("/:id", withValidation(directOrderSchema.omit({ hotel_id: true }), updateOrder));

/**
 * @openapi
 * /api/v1/orders/:id:
 *   delete:
 *     summary: Delete an order
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
orderRoute.delete("/:id", deleteOrder);

export default orderRoute;
