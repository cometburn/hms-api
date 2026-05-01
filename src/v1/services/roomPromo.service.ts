import { RoomPromo } from "@prisma/client";
import { RequestParams } from "@/interfaces";
import * as RoomPromoRepository from "@/repositories/roomPromo.repository";

/**
 * Get all room promos
 * @param hotelId
 * @param page
 * @param limit
 * @param search
 * @returns all room promos
 */
export const getAllRoomPromos = async ({ hotelId, page, limit, search }: RequestParams) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        RoomPromoRepository.getRoomPromos(hotelId, search, skip, limit),
        RoomPromoRepository.countRoomPromos(hotelId, search),
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
 * Create room promo
 * @param hotelId
 * @param data
 * @returns created room promo
 */
export const createRoomPromo = async (hotelId: number, data: any) => {
    return await RoomPromoRepository.createRoomPromo({
        ...data,
        hotel_id: hotelId,
    });
};

/**
 * Update room promo
 * @param hotelId
 * @param id
 * @param data
 * @returns updated room promo
 */
export const updateRoomPromo = async (hotelId: number, id: number, data: Partial<RoomPromo>) => {
    return await RoomPromoRepository.updateRoomPromo(hotelId, id, data);
};

/**
 * Delete room type
 * @param hotelId
 * @param id
 * @returns deleted room type
 */
export const deleteRoomPromo = async (hotelId: number, id: number) => {
    return await RoomPromoRepository.deleteRoomPromo(hotelId, id);
};