import { Room } from "@prisma/client";
import {
    getRooms,
    countRooms,
    createRoomRepository,
    updateRoomRepository,
    deleteRoomRepository,
} from "@/repositories/room.repository";
import { RequestParams } from "@/interfaces"

export const getAllRoomsService = async ({
    hotelId,
    page,
    limit,
    search,
}: RequestParams) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        getRooms(hotelId, search, skip, limit),
        countRooms(hotelId, search),
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

export const createRoomService = async (hotelId: number, data: any) => {
    return await createRoomRepository({
        ...data,
        hotel_id: hotelId,
    });
};

export const updateRoomService = async (
    hotelId: number,
    id: number,
    data: Partial<Room>
) => {
    return await updateRoomRepository(hotelId, id, data);
};

/**
 * Delete room type service
 * @param hotelId
 * @param id
 * @returns deleted room type
 */
export const deleteRoomService = async (hotelId: number, id: number) => {
    return await deleteRoomRepository(hotelId, id);
};
