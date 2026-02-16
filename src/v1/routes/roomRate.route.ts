import { Router } from "express";
import {
  getAllRoomRates,
  createRoomRate,
  updateRoomRate,
  deleteRoomRate,
  getRoomRatesByRoomTypeId
} from "@/controllers/roomRate.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { roomRateSchema } from "@/interfaces/types/roomRate.types";

const roomRateRoute = Router();

roomRateRoute.get("/", getAllRoomRates);
roomRateRoute.post("/", withValidation(roomRateSchema, createRoomRate));
roomRateRoute.put("/:id", withValidation(roomRateSchema.partial(), updateRoomRate));
roomRateRoute.delete("/:id", deleteRoomRate);
roomRateRoute.get("/room-type/:roomTypeId", getRoomRatesByRoomTypeId);


export default roomRateRoute;
