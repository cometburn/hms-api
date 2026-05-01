import { RoomType } from "@prisma/client";
import * as RoomTypeRepository from "@/repositories/roomType.repository";
import { RequestParams } from "@/interfaces";

/**
 * Gets all room types
 * @param  hotelId
 * @param  page
 * @param  limit
 * @param  search
 * @returns
 */
export const getAllRoomTypes = async ({ hotelId, page, limit, search }: RequestParams) => {
    const skip = page > 0 && limit > 0 ? (page - 1) * limit : undefined;
    const take = limit > 0 ? limit : undefined;

    const [data, total] = await Promise.all([
        RoomTypeRepository.getRoomTypes(hotelId, search, skip, take),
        RoomTypeRepository.countRoomTypes(hotelId, search),
    ]);

    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

    return {
        data,
        meta: {
            total,
            page: page || 1,
            limit: limit || total,
            totalPages,
        },
    };
};

/**
 * Creates room type
 * @param hotelId
 * @param data
 * @return created room type
 */
export const createRoomType = async (hotelId: number, data: any) => {
    return await RoomTypeRepository.createRoomType({
        ...data,
        hotel_id: hotelId,
    });
};

/**
 * Update room type
 * @param hotelId
 * @param id
 * @param data
 * @returns updated room type
 */
export const updateRoomType = async (hotelId: number, id: number, data: Partial<RoomType>) => {
    return await RoomTypeRepository.updateRoomType(hotelId, id, data);
};

/**
 * Delete room type
 * @param hotelId
 * @param id
 * @returns deleted room type
 */
export const deleteRoomType = async (hotelId: number, id: number) => {
    return await RoomTypeRepository.deleteRoomType(hotelId, id);
};