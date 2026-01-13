import prisma from "@/helpers/prisma.helper";
import { createHotel } from "@/repositories/hotel.repository";
import { createUserHotelLink } from "@/repositories/userHotel.repository";
import { getUserHotels } from "@/repositories/user.repository";

export const createHotelService = async (userId: number, data: any) => {
  const hotel = await prisma.$transaction(async (tx) => {
    const newHotel = await createHotel(data);
    const existing = await getUserHotels(userId);

    await createUserHotelLink(userId, newHotel.id, existing.length === 0);
    return newHotel;
  });

  return hotel;
};
