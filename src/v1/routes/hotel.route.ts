import { Router } from "express";
import { HotelController } from "@/controllers/hotel.controller";

import { hotelSchema } from "@/interfaces/types/hotel.types";
import { withValidation } from "@/middlewares/validation.middleware";
import { protect } from "@/middlewares/auth.middleware";

const router = Router();
const controller = new HotelController();

/**
 * @openapi
 * /api/v1/hotels:
 *   post:
 *     summary: Create a new hotel
 *     tags:
 *       - Hotels
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Hotel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
router.post("/", protect, withValidation(hotelSchema, controller.createHotel));

export default router;
