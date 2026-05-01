import { Router } from "express";

import { withValidation } from "@/middlewares/validation.middleware";
import { getAllRoomPromos, createRoomPromo, updateRoomPromo, deleteRoomPromo } from "@/controllers/roomPromo.controller";
import { roomPromoSchema } from "@/interfaces/types/roomPromo.types";

const roomPromoRoute = Router();

/**
 * @openapi
 * /api/v1/room-promos:
 *   get:
 *     summary: Get all room promos
 *     tags:
 *       - Room Promos
 *     responses:
 *       200:
 *         description: Room promos fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomPromoRoute.get("/", getAllRoomPromos);

/**
 * @openapi
 * /api/v1/room-promos:
 *   post:
 *     summary: Create a new room promo
 *     tags:
 *       - Room Promos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Room promo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomPromoRoute.post("/", withValidation(roomPromoSchema, createRoomPromo));

/**
 * @openapi
 * /api/v1/room-promos/:id:
 *   put:
 *     summary: Update a room promo
 *     tags:
 *       - Room Promos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Room promo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomPromoRoute.put(
    "/:id",
    withValidation(roomPromoSchema.partial(), updateRoomPromo)
);

/**
 * @openapi
 * /api/v1/room-promos/:id:
 *   delete:
 *     summary: Delete a room promo
 *     tags:
 *       - Room Promos
 *     responses:
 *       200:
 *         description: Room promo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomPromoRoute.delete("/:id", deleteRoomPromo);

export default roomPromoRoute;
