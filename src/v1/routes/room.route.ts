import { Router } from "express";
import { RoomController } from "@/controllers/room.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { roomSchema } from "@/interfaces/types/room.types";

const roomRoute = Router();
const roomController = new RoomController();

roomRoute.get("/", roomController.getAllRooms);
roomRoute.post("/", withValidation(roomSchema, roomController.createRoom));
roomRoute.put("/:id", withValidation(roomSchema.partial(), roomController.updateRoom));
roomRoute.delete("/:id", roomController.deleteRoom);

export default roomRoute;
