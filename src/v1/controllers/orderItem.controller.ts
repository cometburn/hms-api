import { NextFunction, Request, Response } from "express";
import { OrderItemService } from "@/services/orderItem.service";
import { socketService } from "@/sockets/socket.service";
import { NotFoundError } from "@/helpers/error.helper";

export class OrderItemController {
    private orderItemService: OrderItemService;

    constructor() {
        this.orderItemService = new OrderItemService();

        this.getOrderItems = this.getOrderItems.bind(this);
        this.createOrderItem = this.createOrderItem.bind(this);
        this.deleteOrderItem = this.deleteOrderItem.bind(this);
    }

    /**
     * Gets all Order items
     * @param req
     * @param res
     */
    getOrderItems = async (req: Request, res: Response) => {
        const result = await this.orderItemService.getOrderItemService({
            orderId: Number(req.params.orderId),
        });

        return res.json(result);
    };

    /**
     * Creates a Order item
     * @param req
     * @param res
     */
    createOrderItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const data = req.body;

            if (!user.default_hotel) throw new NotFoundError("User hotel missing");

            const result = await this.orderItemService.createOrderItemService({
                ...data,
                user_id: user.id,
            });

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
    deleteOrderItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const { orderItemId } = req.params;

            if (!user.default_hotel) {
                throw new NotFoundError("User hotel missing");
            }

            await this.orderItemService.deleteOrderItemService(Number(orderItemId));

            return res.status(200).json({
                message: "Order item deleted successfully",
            });
        } catch (err) {
            next(err);
        }
    };
}
