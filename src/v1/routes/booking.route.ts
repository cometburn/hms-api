import express from "express";
import { createBooking } from "@/controllers/booking.controller";
import { withValidation } from "@/middlewares/validation.middleware";
import { bookingSchema } from "@/interfaces/types/booking.types";

const bookingRoute = express.Router();

bookingRoute.post("/", withValidation(bookingSchema, createBooking));

export default bookingRoute;
