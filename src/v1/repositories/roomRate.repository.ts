import prisma from "@/helpers/prisma.helper";
import { RoomRate, RoomType } from "@prisma/client";

export class RoomRateRepository {
    /**
     * Gets all room rates
     * @param hotelId
     * @param search
     * @param skip
     * @param limit
     * @returns
     */
    getRoomRates = async (hotelId: number, search: string, skip: number, limit: number) => {
        return await prisma.roomRate.findMany({
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
        });
    };

    /**
     * Counts room rates
     * @param hotelId
     * @param search
     * @returns
     */
    countRoomRates = async (hotelId: number, search: string) => {
        return await prisma.roomRate.count({
            where: {
                hotel_id: hotelId,
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });
    };

    createRoomRateRepository = async (data: any) => {
        return await prisma.roomRate.create({ data });
    };

    /**
     * Updates room rate
     * @param hotelId
     * @param id
     * @param data
     * @returns
     */
    updateRoomRateRepository = async (hotelId: number, id: number, data: Partial<RoomRate>) => {
        return prisma.roomRate.update({
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
    deleteRoomRateRepository = async (hotelId: number, id: number) => {
        return prisma.roomRate.delete({
            where: {
                id,
                hotel_id: hotelId,
            },
        });
    };

    /**
     * Gets room rates by room type id
     * @param hotelId
     * @param roomTypeId
     * @returns
     */
    getRoomRatesByRoomTypeIdRepository = async (hotelId: number, roomTypeId: number) => {
        return await prisma.roomRate.findMany({
            where: {
                hotel_id: hotelId,
                room_type_id: roomTypeId,
            },
        });
    };
}
