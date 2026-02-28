import { Request, Response } from "express";
import { BookingTransferService } from "../services/bookingTransfer.service";
import { NotFoundError } from "@/helpers/error.helper";

export class BookingTransferController {
    private transferService: BookingTransferService;

    constructor() {
        this.transferService = new BookingTransferService();

        this.transferBooking = this.transferBooking.bind(this);
        this.getTransferHistory = this.getTransferHistory.bind(this);
    }

    async transferBooking(req: Request, res: Response) {
        try {
            const user = req.user!;
            const data = req.body;

            if (!data.original_booking_id || !data.room_id) {
                return res.status(400).json({
                    success: false,
                    message: "Original booking ID and new room ID are required"
                });
            }

            if (!user.default_hotel) throw new NotFoundError("User hotel missing");

            const newBooking = await this.transferService.transferBooking(
                user.default_hotel.id,
                user.id,
                data
            )

            return res.status(200).json({
                success: true,
                message: "Booking transferred successfully",
                data: newBooking
            });
        } catch (error: any) {
            console.error("Transfer booking error:", error);
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to transfer booking"
            });
        }
    }

    async getTransferHistory(req: Request, res: Response) {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                return res.status(400).json({
                    success: false,
                    message: "Booking ID is required"
                });
            }

            const history = await this.transferService.getTransferHistory(Number(bookingId));

            return res.status(200).json({
                success: true,
                data: history
            });
        } catch (error: any) {
            console.error("Get transfer history error:", error);
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to get transfer history"
            });
        }
    }
}