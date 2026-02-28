import { Router } from "express";
import { OrderItemController } from "@/controllers/orderItem.controller";
import { withValidation } from "@/middlewares/validation.middleware";
import { orderItemSchema } from "@/interfaces/types/orderItem.types";

const orderItemRoute = Router();
const orderItemController = new OrderItemController();

orderItemRoute.get("/:orderId", orderItemController.getOrderItems);
orderItemRoute.post("/", withValidation(orderItemSchema, orderItemController.createOrderItem));
orderItemRoute.delete("/:orderItemId", orderItemController.deleteOrderItem);

export default orderItemRoute;
