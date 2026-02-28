import { Router } from "express";
import { RoomRateController } from "@/controllers/roomRate.controller";

import { withValidation } from "@/middlewares/validation.middleware";
import { roomRateSchema } from "@/interfaces/types/roomRate.types";

const roomRateRoute = Router();
const roomRateController = new RoomRateController();

roomRateRoute.get("/", roomRateController.getAllRoomRates);
roomRateRoute.post("/", withValidation(roomRateSchema, roomRateController.createRoomRate));
roomRateRoute.put(
    "/:id",
    withValidation(roomRateSchema.partial(), roomRateController.updateRoomRate)
);
roomRateRoute.delete("/:id", roomRateController.deleteRoomRate);
roomRateRoute.get("/room-type/:roomTypeId", roomRateController.getRoomRatesByRoomTypeId);

export default roomRateRoute;
