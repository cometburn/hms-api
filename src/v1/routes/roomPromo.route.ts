import { Router } from "express";
import {
  getAllRoomPromos,
  createRoomPromo,
  updateRoomPromo,
  deleteRoomPromo,
} from "@/controllers/roomPromo.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { roomPromoSchema } from "@/interfaces/types/roomPromo";

const roomType = Router();

roomType.get("/", getAllRoomPromos);
roomType.post("/", withValidation(roomPromoSchema, createRoomPromo));
roomType.put(
  "/:id",
  withValidation(roomPromoSchema.partial(), updateRoomPromo)
);
roomType.delete("/:id", deleteRoomPromo);

export default roomType;
