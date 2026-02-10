import { Router } from "express";
import {
  getAllRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "@/controllers/roomType.controller";

import { roomTypeSchema } from "@/interfaces/types/roomType.types";
import { withValidation } from "@/middlewares/validation.middleware";

const roomType = Router();

roomType.get("/", getAllRoomTypes);
roomType.post("/", withValidation(roomTypeSchema, createRoomType));
roomType.put("/:id", withValidation(roomTypeSchema.partial(), updateRoomType));
roomType.delete("/:id", deleteRoomType);

export default roomType;
