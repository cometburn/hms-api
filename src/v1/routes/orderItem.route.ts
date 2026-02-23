import express from "express";
import { getOrderItems, createOrderItem, deleteOrderItem } from "@/controllers/orderItem.controller";
import { withValidation } from "@/middlewares/validation.middleware";
import { orderItemSchema } from "@/interfaces/types/orderItem.types";

const orderItemRoute = express.Router();

orderItemRoute.get("/:orderId", getOrderItems);
orderItemRoute.post("/", withValidation(orderItemSchema, createOrderItem));
orderItemRoute.delete("/:orderItemId", deleteOrderItem);

export default orderItemRoute;
