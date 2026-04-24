import { Router } from "express";
import { RoomPromoController } from "@/controllers/roomPromo.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { roomPromoSchema } from "@/interfaces/types/roomPromo.types";

const roomPromoRoute = Router();
const roomPromoController = new RoomPromoController();

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
roomPromoRoute.get("/", roomPromoController.getAllRoomPromos);

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
roomPromoRoute.post("/", withValidation(roomPromoSchema, roomPromoController.createRoomPromo));

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
    withValidation(roomPromoSchema.partial(), roomPromoController.updateRoomPromo)
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
roomPromoRoute.delete("/:id", roomPromoController.deleteRoomPromo);

export default roomPromoRoute;
