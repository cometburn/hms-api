import { Router } from "express";
import { getInventories } from "@/controllers/inventory.controller";

const inventoryRoute = Router();

/**
 * @openapi
 * /api/v1/inventories:
 *   get:
 *     summary: Get all inventories
 *     tags:
 *       - Inventories
 *     responses:
 *       200:
 *         description: Inventories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
inventoryRoute.get("/", getInventories);

export default inventoryRoute;
