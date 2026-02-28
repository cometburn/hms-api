import { Router } from "express";
import { BookingTransferController } from "../controllers/bookingTransfer.controller";
import { withValidation } from "@/middlewares/validation.middleware";
import { bookingSchema, transferBookingSchema } from "@/interfaces/types/booking.types";

const router = Router();
const controller = new BookingTransferController();

// POST /api/bookings/transfer
router.post("/", withValidation(transferBookingSchema, controller.transferBooking));

// GET /api/bookings/:bookingId/transfer-history
router.get("/:bookingId/history", (req, res) => controller.getTransferHistory(req, res));

export default router;