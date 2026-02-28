import { NextFunction, Request, Response } from "express";
import { OrderService } from "@/services/order.service";
import { socketService } from "@/sockets/socket.service";
import { NotFoundError } from "@/helpers/error.helper";

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }
    /**
     * Gets all  orders
     * @param req
     * @param res
     */
    getOrders = async (req: Request, res: Response) => {
        const result = await this.orderService.getOrder({
            bookingId: Number(req.params.bookingId),
        });

        return res.json(result);
    };

    /**
     * Creates a  order
     * @param req
     * @param res
     */
    createOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const data = req.body;

            if (!user.default_hotel) throw new NotFoundError("User hotel missing");

            const result = await this.orderService.createOrder({
                ...data,
                user_id: user.id,
            });

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

    /**
     * Deletes  order
     * @param req
     * @param res
     */
    deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const { Id } = req.params;

            if (!user.default_hotel) {
                throw new NotFoundError("User hotel missing");
            }

            await this.orderService.deleteOrder(Number(Id));

            return res.status(200).json({
                message: " Order deleted successfully",
            });
        } catch (err) {
            next(err);
        }
    };
}
