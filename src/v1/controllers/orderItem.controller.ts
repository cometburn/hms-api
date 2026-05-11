import { NextFunction, Request, Response } from "express";
import { socketService } from "@/sockets/socket.service";
import { NotFoundError } from "@/helpers/error.helper";

import * as OrderItemService from "@/services/orderItem.service";

/**
 * Gets all Order items
 * @param req
 * @param res
 */
export const getOrderItems = async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const result = await OrderItemService.getOrderItems(Number(orderId));

    return res.json(result);
};

/**
 * Creates a Order item
 * @param req
 * @param res
 */
export const createOrderItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const data = req.body;

        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const result = await OrderItemService.createOrderItem(
            data,
            user.default_hotel.id,
            data.booking_id ?? null,
            user.id,
        );

        socketService.emitToHotelUsers(
            `hotel_${user.default_hotel.id}`,
            "order_item_created",
            result
        );

        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * Deletes Order item
 * @param req
 * @param res
 */
export const deleteOrderItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { orderItemId } = req.params;

        if (!user.default_hotel) {
            throw new NotFoundError("User hotel missing");
        }

        await OrderItemService.deleteOrderItem(user.default_hotel.id, Number(orderItemId));

        return res.status(200).json({
            message: "Order item deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};