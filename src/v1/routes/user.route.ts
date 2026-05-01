import { Router } from "express";
import { switchHotelSchema } from "@/interfaces/types/hotel.types";
import { withValidation } from "@/middlewares/validation.middleware";
import { switchDefaultHotel } from "@/controllers/user.controller";

const userRoute = Router();

/**
 * @openapi
 * /api/v1/users/hotel/{id}/switch:
 *   post:
 *     summary: Switch default hotel
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
userRoute.post("/hotel/:hotel_id/switch", switchDefaultHotel);

export default userRoute;
