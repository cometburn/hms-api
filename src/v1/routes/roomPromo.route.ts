import { Router } from "express";
import { RoomPromoController } from "@/controllers/roomPromo.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { roomPromoSchema } from "@/interfaces/types/roomPromo.types";

const roomPromoRoute = Router();
const roomPromoController = new RoomPromoController();

roomPromoRoute.get("/", roomPromoController.getAllRoomPromos);
roomPromoRoute.post("/", withValidation(roomPromoSchema, roomPromoController.createRoomPromo));
roomPromoRoute.put(
    "/:id",
    withValidation(roomPromoSchema.partial(), roomPromoController.updateRoomPromo)
);
roomPromoRoute.delete("/:id", roomPromoController.deleteRoomPromo);

export default roomPromoRoute;
