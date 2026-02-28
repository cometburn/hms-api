import prisma from "@/helpers/prisma.helper";
import { Room } from "@prisma/client";

export class RoomRepository {
    /**
     * Gets all rooms
     * @param hotelId
     * @param search
     * @param skip
     * @param limit
     * @returns
     */
    getRooms = async (hotelId: number, search: string, skip: number, limit: number) => {
        return await prisma.room.findMany({
            where: {
                hotel_id: hotelId,
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            orderBy: { name: "asc" },
            skip,
            take: limit,
            include: {
                room_type: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    };

    /**
     * Gets all rooms by room type id
     * @param roomTypeId
     * @returns
     */
    getRoomsByRoomTypeId = async (roomTypeId: number) => {
        return await prisma.room.findMany({
            where: {
                room_type_id: roomTypeId,
            },
            include: {
                room_type: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    };

    getAvailableRoomsByRoomTypeId = async (hotelId: number, roomTypeId: number) => {
        return await prisma.room.findMany({
            where: {
                room_type_id: roomTypeId,
                operational_status: "available",
                bookings: {
                    none: {
                        hotel_id: hotelId,
                        status: { equals: "check_in" },
                    },
                },
            },
            include: {
                bookings: true,
                room_type: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    };

    /**
     * Counts rooms
     * @param hotelId
     * @param search
     * @returns
     */
    countRooms = async (hotelId: number, search: string) => {
        return await prisma.room.count({
            where: {
                hotel_id: hotelId,
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });
    };

    /**
     * Creates a room
     * @param data
     * @returns
     */
    createRoomRepository = async (data: any) => {
        return await prisma.room.create({ data });
    };

    /**
     * Updates a room
     * @param hotelId
     * @param id
     * @param data
     * @returns
     */
    updateRoomRepository = async (hotelId: number, id: number, data: Partial<Room>) => {
        return prisma.room.update({
            where: { id, hotel_id: hotelId },
            data,
        });
    };

    /**
     * Deletes a room
     * @param hotelId
     * @param id
     * @returns
     */
    deleteRoomRepository = async (hotelId: number, id: number) => {
        return prisma.room.delete({
            where: {
                id,
                hotel_id: hotelId,
            },
        });
    };
}
