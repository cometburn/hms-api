import { NextFunction, Request, Response } from "express";
import { BookingAddonService } from "@/services/bookingAddon.service";
import { socketService } from "@/sockets/socket.service";
import { NotFoundError } from "@/helpers/error.helper";
import { deleteRoomService } from "@/services/room.service";

export class BookingAddonController {
    private bookingAddonService: BookingAddonService;
    constructor() {
        this.bookingAddonService = new BookingAddonService();
    }

    /**
     * Gets all booking addons
     * @param req
     * @param res
     */
    getBookingAddons = async (req: Request, res: Response) => {
        const result = await this.bookingAddonService.getBookingAddonService({
            bookingId: Number(req.params.bookingId),
        });

        return res.json(result);
    };

    /**
     * Creates a booking addon
     * @param req
     * @param res
     */
    createBookingAddon = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const data = req.body;

            if (!user.default_hotel) throw new NotFoundError("User hotel missing");

            const result = await this.bookingAddonService.createBookingAddonService({
                ...data,
                user_id: user.id,
            });

            socketService.emitToHotelUsers(
                `hotel_${user.default_hotel.id}`,
                "addon_created",
                result
            );

            return res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Deletes booking addon
     * @param req
     * @param res
     */
    deleteBookingAddon = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const { bookingId } = req.params;

            if (!user.default_hotel) {
                throw new NotFoundError("User hotel missing");
            }

            await this.bookingAddonService.deleteBookingAddonService(Number(bookingId));

            return res.status(200).json({
                message: "Booking addon deleted successfully",
            });
        } catch (err) {
            next(err);
        }
    };
}
