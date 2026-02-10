import { Router } from "express";
import { switchDefaultHotel } from "@/controllers/user.controller";
import { switchHotelSchema } from "@/interfaces/types/hotel.types";
import { withValidation } from "@/middlewares/validation.middleware";

const userRoute = Router();

userRoute.post(
  "/hotel/default",
  withValidation(switchHotelSchema, switchDefaultHotel)
);

export default userRoute;
