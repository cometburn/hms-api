import { Room } from "@prisma/client";
import { RequestParams } from "@/interfaces";
import { BadRequestError } from "@/helpers/error.helper";

import * as RoomRepository from "@/repositories/room.repository";
import { findBookingByRoomId } from "@/repositories/booking.repository";

/**
 * Gets all rooms
 * @param hotelId
 * @param page
 * @param limit
 * @param search
 * @returns
 */
export const getAllRooms = async ({ hotelId, page, limit, search }: RequestParams) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        RoomRepository.getRooms(hotelId, search, skip, limit),
        RoomRepository.countRooms(hotelId, search),
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
 * Gets all rooms by room type id
 * @param roomTypeId
 * @returns
 */
export const getRoomsByRoomTypeId = async (roomTypeId: number) => {
    return await RoomRepository.getRoomsByRoomTypeId(roomTypeId);
};

/**
 * Gets all rooms by room type id
 * @param roomTypeId
 * @returns
 */
export const getAvailableRoomsByRoomTypeId = async (hotelId: number, roomTypeId: number) => {
    return await RoomRepository.getAvailableRoomsByRoomTypeId(hotelId, roomTypeId);
};

/**
 * Creates a room
 * @param hotelId
 * @param data
 * @returns created room
 */
export const createRoom = async (hotelId: number, data: any) => {
    return await RoomRepository.createRoom({
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
export const updateRoom = async (hotelId: number, id: number, data: Partial<Room>) => {
    const booking = await findBookingByRoomId(hotelId, id)

    if (booking && booking?.status === 'check_in') {
        throw new BadRequestError("Failed to update room, booking exists.");
    }

    return await RoomRepository.updateRoom(hotelId, id, data);
};

/**
 * Delete room type
 * @param hotelId
 * @param id
 * @returns deleted room type
 */
export const deleteRoom = async (hotelId: number, id: number) => {
    return await RoomRepository.deleteRoom(hotelId, id);
};