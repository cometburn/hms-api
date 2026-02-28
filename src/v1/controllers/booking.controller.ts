import { NextFunction, Request, Response } from "express";
import { socketService } from "@/sockets/socket.service";
import { BookingService } from "@/services/booking.service";
import { NotFoundError } from "@/helpers/error.helper";
import { OrderService } from "@/services/order.service";

export class BookingController {
    private bookingService: BookingService;
    private orderService: OrderService;

    constructor() {
        this.bookingService = new BookingService();
        this.orderService = new OrderService();

        this.getBookingById = this.getBookingById.bind(this);
        this.createBooking = this.createBooking.bind(this);
        this.updateBooking = this.updateBooking.bind(this);
    }

    /**
     * Get Booking By Id
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async getBookingById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const { bookingId } = req.params;
            if (!user.default_hotel) throw new NotFoundError("User hotel missing");

            const result = await this.bookingService.findBookingById(
                user.default_hotel.id,
                Number(bookingId)
            );

            return res.json(result);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Create Booking
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async createBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const data = req.body;

            if (!user.default_hotel) throw new NotFoundError("User hotel missing");

            const booking = await this.bookingService.createBooking({
                ...data,
                hotel_id: user.default_hotel.id,
                user_id: user.id,
            });

            // create order
            await this.orderService.createOrder({
                hotel_id: user.default_hotel.id,
                booking_id: booking.id,
                total_price: 0,
                status: "pending",
            });

            socketService.emitToHotelUsers(
                `hotel_${user.default_hotel.id}`,
                "check_in",
                booking
            );

            return res.status(201).json({
                message: "Booking created successfully",
                data: booking,
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update Booking
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async updateBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            if (!user.default_hotel) throw new NotFoundError("User hotel missing");

            const result = await this.bookingService.updateBooking(
                user.default_hotel.id,
                Number(req.params.bookingId),
                req.body
            );

            socketService.emitToHotelUsers(
                `hotel_${user.default_hotel.id}`,
                "check_out",
                result
            );

            return res.status(200).json({
                message: "Booking updated successfully",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }
}
