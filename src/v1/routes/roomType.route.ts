import { Router } from "express";
import {
  getAllRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "@/controllers/roomType.controller";

import { roomTypeSchema } from "@/interfaces/types/roomType.types";
import { withValidation } from "@/middlewares/validation.middleware";

const roomTypeRoute = Router();

roomTypeRoute.get("/", getAllRoomTypes);
roomTypeRoute.post("/", withValidation(roomTypeSchema, createRoomType));
roomTypeRoute.put("/:id", withValidation(roomTypeSchema.partial(), updateRoomType));
roomTypeRoute.delete("/:id", deleteRoomType);

export default roomTypeRoute;
