import { Router } from "express";
import { BookingController } from "@/controllers/booking.controller";
import { withValidation } from "@/middlewares/validation.middleware";
import { bookingSchema, updateBookingSchema } from "@/interfaces/types/booking.types";

const router = Router();
const controller = new BookingController();

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
router.post("/", withValidation(bookingSchema, controller.createBooking));

/**
 * @openapi
 * /api/v1/bookings/:bookingId:
 *   put:
 *     summary: Update a booking
 *     tags:
 *       - Bookings
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
router.put("/:bookingId", withValidation(updateBookingSchema, controller.updateBooking));

/**
 * @openapi
 * /api/v1/bookings/:bookingId:
 *   get:
 *     summary: Get a booking by ID
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: Booking fetched successfully
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
router.get("/:bookingId", controller.getBookingById);

export default router;
