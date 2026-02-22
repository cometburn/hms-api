import { Room } from "@prisma/client";
import {
    getRooms,
    countRooms,
    createRoomRepository,
    updateRoomRepository,
    deleteRoomRepository,
} from "@/repositories/room.repository";
import { RequestParams } from "@/interfaces"

/**
 * Gets all rooms
 * @param hotelId
 * @param page
 * @param limit
 * @param search
 * @returns
 */
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


/**
 * Creates a room
 * @param hotelId
 * @param data
 * @returns created room
 */
export const createRoomService = async (hotelId: number, data: any) => {
    return await createRoomRepository({
        ...data,
        hotel_id: hotelId,
    });
};

/**
 * Updates a room
 * @param hotelId
 * @param id
 * @param data
 * @returns updated room
 */
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
