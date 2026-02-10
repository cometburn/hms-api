import { Router } from "express";
import {
  getAllRoomRates,
  createRoomRate,
  updateRoomRate,
  deleteRoomRate,
} from "@/controllers/roomRate.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { roomRateSchema } from "@/interfaces/types/roomRate.types";

const roomType = Router();

roomType.get("/", getAllRoomRates);
roomType.post("/", withValidation(roomRateSchema, createRoomRate));
roomType.put("/:id", withValidation(roomRateSchema.partial(), updateRoomRate));
roomType.delete("/:id", deleteRoomRate);

export default roomType;
