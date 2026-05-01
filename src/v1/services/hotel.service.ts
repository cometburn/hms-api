import prisma from "@/helpers/prisma.helper";
import { createHotel as createHotelRepo } from "@/repositories/hotel.repository";
import { createUserHotelLink } from "@/repositories/userHotel.repository";
import { getUserHotels } from "@/repositories/user.repository";

/**
 * Creates a hotel
 * @param userId
 * @param data
 * @returns
 */
export const createHotel = async (userId: number, data: any) => {
    const hotel = await prisma.$transaction(async (tx) => {
        const newHotel = await createHotelRepo(data);
        const existing = await getUserHotels(userId);

        await createUserHotelLink(userId, newHotel.id, existing.length === 0);
        return newHotel;
    });

    return hotel;
};