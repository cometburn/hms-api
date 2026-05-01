import { BookingAddon } from "@prisma/client";
import { BookingAddonRequestParams } from "@/interfaces/types/bookingAddon.types";
import * as BookingAddonRepository from "@/repositories/bookingAddon.repository";

/**
 * Gets all booking addons
 * @param bookingId
 * @returns
 */
export const getBookingAddons = async ({ bookingId }: BookingAddonRequestParams) => {
    return await BookingAddonRepository.getBookingAddOns(bookingId);
};

/**
 * Create Booking Addon 
 * @param data
 * @returns created Booking Addon
 */
export const createBookingAddon = async (data: BookingAddon) => {
    return await BookingAddonRepository.createBookingAddon(data);
};

/**
 * Deletes booking addon
 * @param bookingId
 */
export const deleteBookingAddon = async (bookingId: number) => {
    return await BookingAddonRepository.deleteBookingAddon(bookingId);
};