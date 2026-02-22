import { BookingAddon } from "@prisma/client";
import {
    getBookingAddOnsRepository,
    createBookingAddonRepository,
    deleteBookingAddonRepository
} from "@/repositories/bookingAddon.respository";
import { BookingAddonRequestParams } from "@/interfaces/types/bookingAddon.types";

/**
 * Gets all booking addons
 * @param bookingId
 * @returns
 */
export const getBookingAddonService = async ({ bookingId }: BookingAddonRequestParams) => {
    return await getBookingAddOnsRepository(bookingId);
};


/**
 * Create Booking Addon service
 * @param data
 * @returns created Booking Addon
 */
export const createBookingAddonService = async (data: BookingAddon) => {
    return await createBookingAddonRepository(data);
};

/**
 * Deletes booking addon
 * @param bookingId
 */
export const deleteBookingAddonService = async (
    bookingId: number
) => {
    return await deleteBookingAddonRepository(bookingId);
};
