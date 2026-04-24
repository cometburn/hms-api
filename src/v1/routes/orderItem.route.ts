import { Router } from "express";
import { OrderItemController } from "@/controllers/orderItem.controller";
import { withValidation } from "@/middlewares/validation.middleware";
import { orderItemSchema } from "@/interfaces/types/orderItem.types";

const orderItemRoute = Router();
const orderItemController = new OrderItemController();

/**
 * @openapi
 * /api/v1/order-items/:orderId:
 *   get:
 *     summary: Get order items by order ID
 *     tags:
 *       - Order Items
 *     responses:
 *       200:
 *         description: Order items fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
orderItemRoute.get("/:orderId", orderItemController.getOrderItems);

/**
 * @openapi
 * /api/v1/order-items:
 *   post:
 *     summary: Create a new order item
 *     tags:
 *       - Order Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Order item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
orderItemRoute.post("/", withValidation(orderItemSchema, orderItemController.createOrderItem));

/**
 * @openapi
 * /api/v1/order-items/:orderItemId:
 *   delete:
 *     summary: Delete an order item
 *     tags:
 *       - Order Items
 *     responses:
 *       200:
 *         description: Order item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
orderItemRoute.delete("/:orderItemId", orderItemController.deleteOrderItem);

export default orderItemRoute;
