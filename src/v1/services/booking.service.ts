import { Booking, BookingCharge } from "@prisma/client";

import { compareObjects } from "@/utils/object.utils";
import { BadRequestError, NotFoundError } from "@/helpers/error.helper";
import { BOOKING_EDIT_WINDOW_MINUTES } from "@/constants";

import * as BookingRepository from "@/repositories/booking.repository";
import { getOrder } from "@/services/order.service";
import { updateOrder } from "@/repositories/order.repository";
import { getOrderItems } from "@/services/orderItem.service";
import { getInventoryByProductId, updateInventory } from "@/services/inventory.service";
import { createProductMovement } from "@/services/productMovement.service";
import { createCharge } from "@/repositories/bookingCharge.repository";

/**
 * Get all Bookings service
 * @param hotelId
 * @param search
 * @param page
 * @param limit
 * @returns
 */
export const getAllBookings = async (hotelId: number, search: string, page: number, limit: number, status: string = "check_out") => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        BookingRepository.getBookings(hotelId, search, skip, limit, status),
        BookingRepository.countBookings(hotelId, search, status),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages,
        },
    };
}

/**
 * Create Booking service
 * @param data
 * @returns
 */
export const createBooking = async (data: Booking) => {
    return await BookingRepository.createBooking(data);
}

/**
 * Update Booking service
 * @param hotelId
 * @param bookingId
 * @param data
 * @returns
 */
export const updateBooking = async (hotelId: number, userId: number, bookingId: number, data: Booking) => {
    const booking = await BookingRepository.findBookingById(hotelId, bookingId);
    if (!booking) throw new NotFoundError("Booking not found");

    const payload = {
        ...data,
        start_datetime: new Date(data.start_datetime),
        end_datetime: new Date(data.end_datetime),
    };

    switch (payload.status) {
        case "cancelled":
            const changes = compareObjects(booking, payload, [
                "room_rate_id",
                "start_datetime",
                "end_datetime",
                "total_price",
                "extra_person",
            ]);
            const hasChanges = Object.keys(changes).length > 0;

            if (hasChanges) {
                const diffMinutes = Math.floor(
                    (Date.now() - new Date(booking.start_datetime).getTime()) / 60000
                );
                if (diffMinutes > BOOKING_EDIT_WINDOW_MINUTES) {
                    throw new BadRequestError(
                        `Booking start time is over ${BOOKING_EDIT_WINDOW_MINUTES} minutes`
                    );
                }
            }
            break;

        case "check_out":
            const order = await getOrder(bookingId);
            if (order) {
                await updateOrder(hotelId, order.id, {
                    status: "completed",
                });

                const orderItems = await getOrderItems(order.id);
                for (const orderItem of orderItems) {
                    const inventory = await getInventoryByProductId(
                        hotelId,
                        orderItem.product_id
                    );

                    if (inventory) {
                        const inventoryQty = inventory.quantity;
                        const orderItemQty = orderItem.quantity;
                        const inventoryReservedQty = inventory.reserved_qty;
                        const expectedQty = inventoryQty - orderItemQty;
                        const expectedReservedQty = inventoryReservedQty - orderItemQty;

                        await updateInventory(hotelId, inventory.id, {
                            quantity: expectedQty,
                            reserved_qty: expectedReservedQty,
                        });

                        await createProductMovement(userId, {
                            user_id: userId,
                            product_id: orderItem.product_id,
                            quantity: orderItemQty,
                            unit_cost: orderItem.price,
                            type: "booking_order",
                            note: `Order from booking:${bookingId} order:${order.id} order_item:${orderItem.id} quantity:${orderItem.quantity}`,
                        });
                    }
                }
            }

            break;
    }

    return await BookingRepository.updateBookingById(hotelId, bookingId, payload);
}

/**
 * Delete Booking service
 * @param hotelId
 * @param bookingId
 * @returns
 */
export const deleteBooking = async (hotelId: number, bookingId: number) => {
    return await BookingRepository.deleteBooking(hotelId, bookingId);
}

/**
 * Find Booking by Id service
 * @param hotelId
 * @param bookingId
 * @returns
 */
export const findBookingById = async (hotelId: number, bookingId: number) => {
    return await BookingRepository.findBookingById(hotelId, bookingId);
}

/**
 * Update Booking by Id service
 * @param hotelId
 * @param bookingId
 * @param data
 * @returns
 */
export const updateBookingById = async (hotelId: number, bookingId: number, data: any) => {
    return await BookingRepository.updateBookingById(hotelId, bookingId, data);
}