import { Router } from "express";
import { createHotel } from "@/controllers/hotel.controller";

import { hotelSchema } from "@/interfaces/types/hotel.types";
import { withValidation } from "@/middlewares/validation.middleware";
import { protect } from "@/middlewares/auth.middleware";

const hotelRoute = Router();

hotelRoute.post("/", protect, withValidation(hotelSchema, createHotel));

export default hotelRoute;
