import { BookingAddon, BookingCharge, User } from "@prisma/client";
import { BookingRepository } from "../repositories/booking.repository";
import { BookingAddonRepository } from "../repositories/bookingAddon.repository";
import { OrderRepository } from "../repositories/order.repository";
import { OrderItemRepository } from "../repositories/orderItem.repository";
import { BookingChargeRepository } from "../repositories/bookingCharge.repository";
import { BOOKING_EDIT_WINDOW_MINUTES } from "@/constants";

import { socketService } from "@/sockets/socket.service";
import { TransferBooking } from "@/interfaces/types/booking.types";
import { Order } from "@/interfaces/types/order.types";

export class BookingTransferService {
    private bookingRepo: BookingRepository;
    private addonRepo: BookingAddonRepository;
    private orderRepo: OrderRepository;
    private orderItemRepo: OrderItemRepository;
    private chargeRepo: BookingChargeRepository;

    constructor() {
        this.bookingRepo = new BookingRepository();
        this.addonRepo = new BookingAddonRepository();
        this.orderRepo = new OrderRepository();
        this.orderItemRepo = new OrderItemRepository();
        this.chargeRepo = new BookingChargeRepository();
    }

    transferBooking = async (
        hotelId: number,
        userId: number,
        data: TransferBooking
    ) => {
        // Fetch original booking with relations
        const originalBooking = await this.bookingRepo.findBookingById(hotelId, data.original_booking_id);

        if (!originalBooking) {
            throw new Error('Booking not found');
        }

        // Validate transfer is within grace period
        this.validateTransferGracePeriod(originalBooking.start_datetime);

        const now = new Date();

        // Create new booking with transfer tracking
        const newBooking = await this.bookingRepo.createBooking({
            hotel_id: hotelId,
            user_id: userId,
            room_id: data.room_id,
            room_rate_id: data.room_rate_id,
            start_datetime: originalBooking.start_datetime,
            end_datetime: originalBooking.end_datetime,
            extra_person: originalBooking.extra_person,
            total_price: originalBooking.total_price,
            status: data.status,
            payment_status: null,
            payment_type: null,
            note: "",
            transferred_from_booking_id: originalBooking.id,
            transferred_at: now,
            transfer_reason: data.note,
            original_room_id: data.room_id,
        });

        socketService.emitToHotelUsers(
            `hotel_${hotelId}`,
            "check_out",
            originalBooking
        );

        // Copy booking addons if they exist
        await this.copyBookingAddons(
            originalBooking.booking_addons,
            newBooking.id,
            newBooking.room_id,
            originalBooking.id
        );

        // Copy order and order items if they exist
        if (originalBooking.orders) {
            await this.copyOrderWithItems(
                {
                    ...originalBooking.orders,
                    booking_id: newBooking.id,
                    total_price: originalBooking.total_price,
                    status: "pending",
                },
                newBooking.id,
                originalBooking.id
            );
        }

        // Copy booking charges if they exist
        if (data.booking_charges) {
            console.log('data.booking_charges', data.booking_charges)
            await this.copyBookingCharges(
                data.booking_charges ?? [],
                newBooking.id,
                userId,
            );
        }

        // Mark original booking as transferred
        await this.bookingRepo.updateBookingStatus(
            originalBooking.id,
            'transferred',
            `Transferred to Room ${newBooking.room_id} at ${now.toISOString()}. Reason: ${data.note || 'N/A'}`
        );

        socketService.emitToHotelUsers(
            `hotel_${hotelId}`,
            "check_in",
            newBooking
        );

        return newBooking;
    }

    private validateTransferGracePeriod(startDatetime: Date) {
        const now = new Date();
        const timeDiff = now.getTime() - new Date(startDatetime).getTime();
        const minutesDiff = timeDiff / (1000 * 60);

        if (minutesDiff > BOOKING_EDIT_WINDOW_MINUTES) {
            throw new Error(`Transfer not allowed after ${BOOKING_EDIT_WINDOW_MINUTES} minutes of check-in`);
        }
    }

    private async copyBookingAddons(
        addons: BookingAddon[],
        newBookingId: number,
        newRoomId: number,
        originalBookingId: number
    ) {
        if (addons.length === 0) return;

        const addonData = addons.map(addon => ({
            booking_id: newBookingId,
            room_id: newRoomId,
            user_id: addon.user_id,
            product_id: addon.product_id,
            quantity: addon.quantity,
            price: addon.price,
            total_price: addon.total_price,
            added_before_transfer: true,
            transferred_from_booking_id: originalBookingId,
            original_booking_addon_id: addon.id,
        }));

        await this.addonRepo.createManyAddons(addonData as BookingAddon[]);
    }

    private async copyOrderWithItems(
        originalOrder: Order,
        newBookingId: number,
        originalBookingId: number
    ) {
        // Create new order
        const newOrder = await this.orderRepo.createOrder({
            hotel_id: originalOrder.hotel_id,
            booking_id: newBookingId,
            status: originalOrder.status,
            total_price: originalOrder.total_price,
            notes: originalOrder.notes,
            transferred_from_booking_id: originalBookingId,
        });

        // Copy order items if they exist
        if (originalOrder.order_items && originalOrder.order_items.length > 0) {
            const orderItemData = originalOrder.order_items.map((item: any) => ({
                order_id: newOrder.id,
                user_id: item.user_id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                total_price: item.total_price,
                notes: item.notes,
                added_before_transfer: true,
                transferred_from_booking_id: originalBookingId,
                original_order_item_id: item.id,
            }));

            await this.orderItemRepo.createManyOrderItems(orderItemData);
        }
    }

    private async copyBookingCharges(
        charges: Array<{ name?: string; price?: number; booking_id?: number; room_id?: number }>,
        newBookingId: number,
        userId: number,
    ) {
        if (charges.length === 0) return;

        const chargeData = charges.map(charge => ({
            booking_id: newBookingId,
            user_id: userId,
            room_id: charge.room_id,
            name: charge.name,
            price: charge.price,
        }));

        await this.chargeRepo.createManyCharges(chargeData as BookingCharge[]);
    }

    getTransferHistory = async (bookingId: number) => {
        const booking = await this.bookingRepo.getBookingTransferHistory(bookingId);

        if (!booking) {
            throw new Error('Booking not found');
        }

        return {
            current: booking,
            addons: {
                beforeTransfer: booking.booking_addons.filter(a => a.added_before_transfer) || [],
                afterTransfer: booking.booking_addons.filter(a => !a.added_before_transfer) || []
            },
            orderItems: {
                beforeTransfer: booking.orders?.order_items.filter(i => i.added_before_transfer) || [],
                afterTransfer: booking.orders?.order_items.filter(i => !i.added_before_transfer) || []
            }
        };
    }
}