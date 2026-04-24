import { Router } from "express";
import { RoomRateController } from "@/controllers/roomRate.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { roomRateSchema } from "@/interfaces/types/roomRate.types";

const roomRateRoute = Router();
const roomRateController = new RoomRateController();

/**
 * @openapi
 * /api/v1/room-rates:
 *   get:
 *     summary: Get all room rates
 *     tags:
 *       - Room Rates
 *     responses:
 *       200:
 *         description: Room rates fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomRateRoute.get("/", roomRateController.getAllRoomRates);

/**
 * @openapi
 * /api/v1/room-rates:
 *   post:
 *     summary: Create a new room rate
 *     tags:
 *       - Room Rates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Room rate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomRateRoute.post("/", withValidation(roomRateSchema, roomRateController.createRoomRate));

/**
 * @openapi
 * /api/v1/room-rates/:id:
 *   put:
 *     summary: Update a room rate
 *     tags:
 *       - Room Rates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Room rate updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomRateRoute.put(
    "/:id",
    withValidation(roomRateSchema.partial(), roomRateController.updateRoomRate)
);

/**
 * @openapi
 * /api/v1/room-rates/:id:
 *   delete:
 *     summary: Delete a room rate
 *     tags:
 *       - Room Rates
 *     responses:
 *       200:
 *         description: Room rate deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomRateRoute.delete("/:id", roomRateController.deleteRoomRate);

/**
 * @openapi
 * /api/v1/room-rates/room-type/:roomTypeId:
 *   get:
 *     summary: Get room rates by room type
 *     tags:
 *       - Room Rates
 *     responses:
 *       200:
 *         description: Room rates fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomRateRoute.get("/room-type/:roomTypeId", roomRateController.getRoomRatesByRoomTypeId);

export default roomRateRoute;
