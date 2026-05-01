import { Router } from "express";
import { withValidation } from "@/middlewares/validation.middleware";
import { bookingSchema, updateBookingSchema } from "@/interfaces/types/booking.types";

import { createBooking, updateBooking, getBookingById } from "@/controllers/booking.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     booking:
 *                       $ref: "#/components/schemas/Booking"
 */
router.post("/", withValidation(bookingSchema, createBooking));

/**
 * @openapi
 * /api/v1/bookings/{bookingId}:
 *   put:
 *     summary: Update a booking
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     booking:
 *                       $ref: "#/components/schemas/Booking"
 */
router.put("/:bookingId", withValidation(updateBookingSchema, updateBooking));

/**
 * @openapi
 * /api/v1/bookings/{bookingId}:
 *   get:
 *     summary: Get booking by ID
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Booking found
 */
router.get("/:bookingId", getBookingById);

export default router;
