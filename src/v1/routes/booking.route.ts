import { Router } from "express";
import { BookingController } from "@/controllers/booking.controller";
import { withValidation } from "@/middlewares/validation.middleware";
import { bookingSchema, updateBookingSchema } from "@/interfaces/types/booking.types";

const router = Router();
const controller = new BookingController();

router.post("/", withValidation(bookingSchema, controller.createBooking));
router.put("/:bookingId", withValidation(updateBookingSchema, controller.updateBooking));
router.get("/:bookingId", controller.getBookingById);

export default router;
