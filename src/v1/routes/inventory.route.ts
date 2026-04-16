import { Router } from "express";
import { InventoryController } from "@/controllers/inventory.controller";

const inventoryRoute = Router();
const inventoryController = new InventoryController();

inventoryRoute.get("/", inventoryController.getInventories);

export default inventoryRoute;
