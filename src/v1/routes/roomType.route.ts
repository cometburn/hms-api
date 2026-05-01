import { Router } from "express";

import { withValidation } from "@/middlewares/validation.middleware";
import { getAllRoomTypes, createRoomType, updateRoomType, deleteRoomType } from "@/controllers/roomType.controller";
import { roomTypeSchema } from "@/interfaces/types/roomType.types";

const roomTypeRoute = Router();

/**
 * @openapi
 * /api/v1/room-types:
 *   get:
 *     summary: Get all room types
 *     tags:
 *       - Room Types
 *     responses:
 *       200:
 *         description: Room types fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomTypeRoute.get("/", getAllRoomTypes);

/**
 * @openapi
 * /api/v1/room-types:
 *   post:
 *     summary: Create a new room type
 *     tags:
 *       - Room Types
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Room type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomTypeRoute.post("/", withValidation(roomTypeSchema, createRoomType));

/**
 * @openapi
 * /api/v1/room-types/:id:
 *   put:
 *     summary: Update a room type
 *     tags:
 *       - Room Types
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Room type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomTypeRoute.put(
    "/:id",
    withValidation(roomTypeSchema.partial(), updateRoomType)
);

/**
 * @openapi
 * /api/v1/room-types/:id:
 *   delete:
 *     summary: Delete a room type
 *     tags:
 *       - Room Types
 *     responses:
 *       200:
 *         description: Room type deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomTypeRoute.delete("/:id", deleteRoomType);

export default roomTypeRoute;
