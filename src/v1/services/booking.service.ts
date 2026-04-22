import { Booking } from "@prisma/client";
import { BookingRepository } from "@/repositories/booking.repository";
import { RequestParams } from "@/interfaces";
import { compareObjects } from "@/utils/object.utils";
import { BadRequestError, NotFoundError } from "@/helpers/error.helper";
import { BOOKING_EDIT_WINDOW_MINUTES } from "@/constants";
import { OrderItemService } from "@/services/orderItem.service";
import { InventoryService } from "./inventory.service";
import { OrderService } from "./order.service";
import { ProductMovementService } from "./productMovement.service";

export class BookingService {
    private bookingRepo: BookingRepository;
    private orderItemService: OrderItemService;
    private inventoryService: InventoryService;
    private orderService: OrderService;
    private productMovementService: ProductMovementService;

    constructor() {
        this.bookingRepo = new BookingRepository();
        this.orderItemService = new OrderItemService();
        this.inventoryService = new InventoryService();
        this.orderService = new OrderService();
        this.productMovementService = new ProductMovementService();
    }

    /**
     * Get all Bookings service
     * @param hotelId
     * @param search
     * @param page
     * @param limit
     * @returns
     */
    async getAllBookings(hotelId: number, search: string, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.bookingRepo.getBookings(hotelId, search, skip, limit),
            this.bookingRepo.countBookings(hotelId, search),
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
    async createBooking(data: Booking) {
        return await this.bookingRepo.createBooking(data);
    }

    /**
     * Update Booking service
     * @param hotelId
     * @param bookingId
     * @param data
     * @returns
     */
    async updateBooking(hotelId: number, userId: number, bookingId: number, data: any) {
        const booking = await this.bookingRepo.findBookingById(hotelId, bookingId);
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
                const order = await this.orderService.getOrder(bookingId);
                if (order) {
                    await this.orderService.updateOrder(hotelId, order.id, {
                        status: "completed",
                    });

                    const orderItems = await this.orderItemService.getOrderItems(order.id);
                    for (const orderItem of orderItems) {
                        const inventory = await this.inventoryService.getInventoryByProductId(
                            hotelId,
                            orderItem.product_id
                        );

                        if (inventory) {
                            const inventoryQty = inventory.quantity;
                            const orderItemQty = orderItem.quantity;
                            const inventoryReservedQty = inventory.reserved_qty;
                            const expectedQty = inventoryQty - orderItemQty;
                            const expectedReservedQty = inventoryReservedQty - orderItemQty;

                            await this.inventoryService.updateInventory(hotelId, inventory.id, {
                                quantity: expectedQty,
                                reserved_qty: expectedReservedQty,
                            });

                            await this.productMovementService.createProductMovementService(userId, {
                                user_id: userId,
                                product_id: orderItem.product_id,
                                quantity: orderItemQty,
                                unit_cost: orderItem.price,
                                type: "booking_order",
                                note: `Order from booking:${bookingId} order:${order.id} order_item:${orderItem.id} quantity:${orderItem.quantity}`,
                            });

                            console.log('product movement created!')
                        }
                    }
                }
                break;
        }

        return await this.bookingRepo.updateBookingById(hotelId, bookingId, payload);
    }

    /**
     * Delete Booking service
     * @param hotelId
     * @param bookingId
     * @returns
     */
    async deleteBooking(hotelId: number, bookingId: number) {
        return await this.bookingRepo.deleteBooking(hotelId, bookingId);
    }

    /**
     * Find Booking by Id service
     * @param hotelId
     * @param bookingId
     * @returns
     */
    async findBookingById(hotelId: number, bookingId: number) {
        return await this.bookingRepo.findBookingById(hotelId, bookingId);
    }

    /**
     * Update Booking by Id service
     * @param hotelId
     * @param bookingId
     * @param data
     * @returns
     */
    async updateBookingById(hotelId: number, bookingId: number, data: any) {
        return await this.bookingRepo.updateBookingById(hotelId, bookingId, data);
    }
}
