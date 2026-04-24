import { Router } from "express";
import { BookingTransferController } from "../controllers/bookingTransfer.controller";
import { withValidation } from "@/middlewares/validation.middleware";
import { bookingSchema, transferBookingSchema } from "@/interfaces/types/booking.types";

const router = Router();
const controller = new BookingTransferController();

/**
 * @openapi
 * /api/v1/booking-transfers:
 *   post:
 *     summary: Transfer a booking
 *     tags:
 *       - Booking Transfers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Booking transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
router.post("/", withValidation(transferBookingSchema, controller.transferBooking));

/**
 * @openapi
 * /api/v1/booking-transfers/:bookingId/history:
 *   get:
 *     summary: Get booking transfer history
 *     tags:
 *       - Booking Transfers
 *     responses:
 *       200:
 *         description: Booking transfer history fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
router.get("/:bookingId/history", (req, res) => controller.getTransferHistory(req, res));

export default router;