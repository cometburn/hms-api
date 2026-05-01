import { Router } from "express";
import { withValidation } from "@/middlewares/validation.middleware";
import { bookingAddonSchema } from "@/interfaces/types/bookingAddon.types";

import {
    getBookingAddons,
    createBookingAddon,
    deleteBookingAddon,
} from "@/controllers/bookingAddon.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/booking-addons/:bookingId:
 *   get:
 *     summary: Get booking addons by booking ID
 *     tags:
 *       - Booking Addons
 *     responses:
 *       200:
 *         description: Booking addons fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
router.get("/:bookingId", getBookingAddons);

/**
 * @openapi
 * /api/v1/booking-addons:
 *   post:
 *     summary: Create a new booking addon
 *     tags:
 *       - Booking Addons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BookingAddonRequest"
 *     responses:
 *       201:
 *         description: Booking addon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
router.post("/", withValidation(bookingAddonSchema, createBookingAddon));

/**
 * @openapi
 * /api/v1/booking-addons/:bookingId:
 *   delete:
 *     summary: Delete a booking addon
 *     tags:
 *       - Booking Addons
 *     responses:
 *       200:
 *         description: Booking addon deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 */
router.delete("/:bookingId", deleteBookingAddon);

export default router;
