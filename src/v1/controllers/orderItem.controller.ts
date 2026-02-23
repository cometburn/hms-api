import { NextFunction, Request, Response } from "express";
import {
    getOrderItemService,
    createOrderItemService,
    deleteOrderItemService
} from "@/services/orderItem.service";
import { socketService } from "@/sockets/socket.service";
import { NotFoundError } from "@/helpers/error.helper";

/**
 * Gets all Order items
 * @param req
 * @param res
 */
export const getOrderItems = async (req: Request, res: Response) => {
    const result = await getOrderItemService({
        orderId: Number(req.params.orderId),
    });

    return res.json(result);
};


/**
 * Creates a Order item
 * @param req
 * @param res
 */
export const createOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const data = req.body;

        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const result = await createOrderItemService({
            ...data,
            user_id: user.id,
        });

        socketService.emitToHotelUsers(`hotel_${user.default_hotel.id}`, "order_item_created", result);

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
export const deleteOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const { orderItemId } = req.params;

        if (!user.default_hotel) {
            throw new NotFoundError("User hotel missing");
        }

        await deleteOrderItemService(Number(orderItemId));

        return res.status(200).json({
            message: "Order item deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};
