import { NextFunction, Request, Response } from "express";
import { socketService } from "@/sockets/socket.service";
import { NotFoundError } from "@/helpers/error.helper";

import * as OrderService from "@/services/order.service";

/**
 * Gets all  orders
 * @param req
 * @param res
 */
export const getOrders = async (req: Request, res: Response) => {
    const user = req.user!;
    if (!user.default_hotel) throw new NotFoundError("User hotel missing");

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const safePage = !isNaN(page) ? page : 1;
    const safeLimit = !isNaN(limit) ? limit : 10;
    const bookingId = req.query.booking_id;
    const status = req.query.status;

    const result = await OrderService.getOrders({
        hotelId: user.default_hotel.id,
        bookingId: bookingId ? Number(bookingId) : null,
        status: status ? String(status) : "",
        page: safePage,
        limit: safeLimit,
    });

    return res.json(result);
};

/**
 * Gets all  orders
 * @param req
 * @param res
 */
export const getOrder = async (req: Request, res: Response) => {
    const bookingId = Number(req.params.bookingId)
    const result = await OrderService.getOrder(bookingId);

    return res.json(result);
};

/**
 * Creates a  order
 * @param req
 * @param res
 */
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const data = req.body;

        if (!user.default_hotel) throw new NotFoundError("User hotel missing");

        const result = await OrderService.createOrder(
            user.default_hotel.id,
            user.id,
            data
        );

        socketService.emitToHotelUsers(
            `hotel_${user.default_hotel.id}`,
            "Order_created",
            result
        );

        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const data = req.body;

        if (!user.default_hotel) throw new NotFoundError("User hotel missing");
        if (!data.id) throw new NotFoundError("Order not found");

        const result = await OrderService.updateOrder(
            user.default_hotel.id,
            user.id,
            data
        );

        socketService.emitToHotelUsers(
            `hotel_${user.default_hotel.id}`,
            "Order_updated",
            result
        );

        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * Deletes  order
 * @param req
 * @param res
 */
export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { Id } = req.params;

        if (!user.default_hotel) {
            throw new NotFoundError("User hotel missing");
        }

        await OrderService.deleteOrder(Number(Id));

        return res.status(200).json({
            message: " Order deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};