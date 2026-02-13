import { Router } from "express";
import {
    getAllRooms,
    createRoom,
    updateRoom,
    deleteRoom,
} from "@/controllers/room.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { roomSchema } from "@/interfaces/types/room.types";

const roomRoute = Router();

roomRoute.get("/", getAllRooms);
roomRoute.post("/", withValidation(roomSchema, createRoom));
roomRoute.put("/:id", withValidation(roomSchema.partial(), updateRoom));
roomRoute.delete("/:id", deleteRoom);

export default roomRoute;
