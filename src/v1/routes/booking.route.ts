import express from "express";
import { createBooking, updateBooking, getBookingById } from "@/controllers/booking.controller";
import { withValidation } from "@/middlewares/validation.middleware";
import { bookingSchema } from "@/interfaces/types/booking.types";

const bookingRoute = express.Router();

bookingRoute.post("/", withValidation(bookingSchema, createBooking));
bookingRoute.put("/:bookingId", withValidation(bookingSchema, updateBooking));
bookingRoute.get("/:bookingId", getBookingById);

export default bookingRoute;
