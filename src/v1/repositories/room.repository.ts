import prisma from "@/helpers/prisma.helper";
import { Room } from "@prisma/client";

export const getRooms = async (
    hotelId: number,
    search: string,
    skip: number,
    limit: number
) => {
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
                }
            }
        },
    });
};

export const countRooms = async (hotelId: number, search: string) => {
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

export const createRoomRepository = async (data: any) => {
    return await prisma.room.create({ data });
};

export const updateRoomRepository = async (
    hotelId: number,
    id: number,
    data: Partial<Room>
) => {
    return prisma.room.update({
        where: { id, hotel_id: hotelId },
        data,
    });
}

/**
 * Deletes a room
 * @param hotelId
 * @param id
 * @returns
 */
export const deleteRoomRepository = async (hotelId: number, id: number) => {
    return prisma.room.delete({
        where: {
            id,
            hotel_id: hotelId,
        },
    });
};
