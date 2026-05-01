import prisma from "@/helpers/prisma.helper";
import { RoomPromo } from "@prisma/client";

/**
 * Gets all room promos
 * @param hotelId
 * @param search
 * @param skip
 * @param limit
 * @returns
 */
export const getRoomPromos = async (hotelId: number, search: string, skip: number, limit: number) => {
    return await prisma.roomPromo.findMany({
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
            room_rate: true,
        },
    });
};

/**
 * Counts all room promos
 * @param hotelId
 * @param search
 * @returns
 */
export const countRoomPromos = async (hotelId: number, search: string) => {
    return await prisma.roomPromo.count({
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
 * Creates a room promo
 * @param data
 * @returns
 */
export const createRoomPromo = async (data: RoomPromo) => {
    return await prisma.roomPromo.create({ data });
};

/**
 * Updates a room promo
 * @param hotelId
 * @param id
 * @param data
 * @returns
 */
export const updateRoomPromo = async (hotelId: number, id: number, data: Partial<RoomPromo>) => {
    return prisma.roomPromo.update({
        where: { id, hotel_id: hotelId },
        data,
    });
};

/**
 * Deletes a room type
 * @param hotelId
 * @param id
 * @returns
 */
export const deleteRoomPromo = async (hotelId: number, id: number) => {
    return prisma.roomPromo.delete({
        where: {
            id,
            hotel_id: hotelId,
        },
    });
};
