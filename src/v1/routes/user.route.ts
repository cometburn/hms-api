import { Router } from "express";
import { switchHotelSchema } from "@/interfaces/types/hotel.types";
import { withValidation } from "@/middlewares/validation.middleware";
import { UserController } from "@/controllers/user.controller";

const userRoute = Router();
const userController = new UserController();

userRoute.post(
    "/hotel/default",
    withValidation(switchHotelSchema, userController.switchDefaultHotel)
);

export default userRoute;
