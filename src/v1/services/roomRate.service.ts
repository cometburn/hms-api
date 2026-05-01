import { RoomRate } from "@prisma/client";

import { RequestParams } from "@/interfaces";
import * as RoomRateRepository from "@/repositories/roomRate.repository";

/**
 * Gets all room rates service
 * @param hotelId
 * @param page
 * @param limit
 * @param search
 * @returns
 */
export const getAllRoomRates = async ({ hotelId, page, limit, search }: RequestParams) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        RoomRateRepository.getRoomRates(hotelId, search, skip, limit),
        RoomRateRepository.countRoomRates(hotelId, search),
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
};

/**
 * Creates a room rate service
 * @param hotelId
 * @param data
 * @returns
 */
export const createRoomRate = async (hotelId: number, data: any) => {
    return await RoomRateRepository.createRoomRate({
        ...data,
        hotel_id: hotelId,
    });
};

/**
 * Updates room rate service
 * @param hotelId
 * @param id
 * @param data
 * @returns
 */
export const updateRoomRate = async (hotelId: number, id: number, data: Partial<RoomRate>) => {
    return await RoomRateRepository.updateRoomRate(hotelId, id, data);
};

/**
 * Delete room type service
 * @param hotelId
 * @param id
 * @returns deleted room type
 */
export const deleteRoomRate = async (hotelId: number, id: number) => {
    return await RoomRateRepository.deleteRoomRate(hotelId, id);
};

/**
 * Gets room rates by room type id service
 * @param hotelId
 * @param roomTypeId
 * @returns
 */
export const getRoomRatesByRoomTypeId = async (hotelId: number, roomTypeId: number) => {
    return await RoomRateRepository.getRoomRatesByRoomTypeId(hotelId, roomTypeId);
};
