import { Router } from "express";
import { RoomTypeController } from "@/controllers/roomType.controller";

import { roomTypeSchema } from "@/interfaces/types/roomType.types";
import { withValidation } from "@/middlewares/validation.middleware";

const roomTypeRoute = Router();
const roomTypeController = new RoomTypeController();

roomTypeRoute.get("/", roomTypeController.getAllRoomTypes);
roomTypeRoute.post("/", withValidation(roomTypeSchema, roomTypeController.createRoomType));
roomTypeRoute.put(
    "/:id",
    withValidation(roomTypeSchema.partial(), roomTypeController.updateRoomType)
);
roomTypeRoute.delete("/:id", roomTypeController.deleteRoomType);

export default roomTypeRoute;
