import { Router } from "express";
import { RoomController } from "@/controllers/room.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { roomSchema } from "@/interfaces/types/room.types";

const roomRoute = Router();
const roomController = new RoomController();

/**
 * @openapi
 * /api/v1/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags:
 *       - Rooms
 *     responses:
 *       200:
 *         description: Rooms fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomRoute.get("/", roomController.getAllRooms);

/**
 * @openapi
 * /api/v1/rooms:
 *   post:
 *     summary: Create a new room
 *     tags:
 *       - Rooms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomRoute.post("/", withValidation(roomSchema, roomController.createRoom));

/**
 * @openapi
 * /api/v1/rooms/:id:
 *   put:
 *     summary: Update a room
 *     tags:
 *       - Rooms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomRoute.put("/:id", withValidation(roomSchema.partial(), roomController.updateRoom));

/**
 * @openapi
 * /api/v1/rooms/:id:
 *   delete:
 *     summary: Delete a room
 *     tags:
 *       - Rooms
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
roomRoute.delete("/:id", roomController.deleteRoom);

export default roomRoute;
