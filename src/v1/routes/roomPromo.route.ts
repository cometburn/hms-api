import { Router } from "express";
import {
  getAllRoomPromos,
  createRoomPromo,
  updateRoomPromo,
  deleteRoomPromo,
} from "@/controllers/roomPromo.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { roomPromoSchema } from "@/interfaces/types/roomPromo.types";

const roomPromoRoute = Router();

roomPromoRoute.get("/", getAllRoomPromos);
roomPromoRoute.post("/", withValidation(roomPromoSchema, createRoomPromo));
roomPromoRoute.put(
  "/:id",
  withValidation(roomPromoSchema.partial(), updateRoomPromo)
);
roomPromoRoute.delete("/:id", deleteRoomPromo);

export default roomPromoRoute;
