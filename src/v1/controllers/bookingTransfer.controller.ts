import { Request, Response } from "express";
import { NotFoundError } from "@/helpers/error.helper";

import * as TransferBookingService from "../services/bookingTransfer.service";

export const transferBooking = async (req: Request, res: Response) => {
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

        const newBooking = await TransferBookingService.transferBooking(
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

export const getTransferHistory = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required"
            });
        }

        const history = await TransferBookingService.getTransferHistory(Number(bookingId));

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