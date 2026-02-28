import { BookingAddon } from "@prisma/client";
import { BookingAddonRepository } from "@/repositories/bookingAddon.repository";
import { BookingAddonRequestParams } from "@/interfaces/types/bookingAddon.types";

export class BookingAddonService {
    private bookingAddonRepository: BookingAddonRepository;
    constructor() {
        this.bookingAddonRepository = new BookingAddonRepository();
    }
    /**
     * Gets all booking addons
     * @param bookingId
     * @returns
     */
    getBookingAddonService = async ({ bookingId }: BookingAddonRequestParams) => {
        return await this.bookingAddonRepository.getBookingAddOnsRepository(bookingId);
    };

    /**
     * Create Booking Addon service
     * @param data
     * @returns created Booking Addon
     */
    createBookingAddonService = async (data: BookingAddon) => {
        return await this.bookingAddonRepository.createBookingAddonRepository(data);
    };

    /**
     * Deletes booking addon
     * @param bookingId
     */
    deleteBookingAddonService = async (bookingId: number) => {
        return await this.bookingAddonRepository.deleteBookingAddonRepository(bookingId);
    };
}
