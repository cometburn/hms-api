import { Router } from "express";
import { switchHotelSchema } from "@/interfaces/types/hotel.types";
import { withValidation } from "@/middlewares/validation.middleware";
import { UserController } from "@/controllers/user.controller";

const userRoute = Router();
const userController = new UserController();

/**
 * @openapi
 * /api/v1/users/hotel/default:
 *   post:
 *     summary: Switch default hotel
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Default hotel switched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
userRoute.post(
    "/hotel/default",
    withValidation(switchHotelSchema, userController.switchDefaultHotel)
);

export default userRoute;
