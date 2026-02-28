import { Router } from "express";
import { HotelController } from "@/controllers/hotel.controller";

import { hotelSchema } from "@/interfaces/types/hotel.types";
import { withValidation } from "@/middlewares/validation.middleware";
import { protect } from "@/middlewares/auth.middleware";

const router = Router();
const controller = new HotelController();

router.post("/", protect, withValidation(hotelSchema, controller.createHotel));

export default router;
