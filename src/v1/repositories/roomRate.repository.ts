import prisma from "@/helpers/prisma.helper";
import { RoomRate, RoomType } from "@prisma/client";

export const getRoomRates = async (
  hotelId: number,
  search: string,
  skip: number,
  limit: number
) => {
  return await prisma.roomRate.findMany({
    where: {
      hotel_id: hotelId,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy: { created_at: "asc" },
    skip,
    take: limit,
  });
};

export const countRoomRates = async (hotelId: number, search: string) => {
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

export const createRoomRateRepository = async (data: any) => {
  return await prisma.roomRate.create({ data });
};

export async function updateRoomRateRepository(
  hotelId: number,
  id: number,
  data: Partial<RoomRate>
) {
  return prisma.roomRate.update({
    where: { id, hotel_id: hotelId },
    data,
  });
}

/**
 * Deletes a room type
 * @param hotelId
 * @param id
 * @returns
 */
export const deleteRoomRateRepository = async (hotelId: number, id: number) => {
  return prisma.roomRate.delete({
    where: {
      id,
      hotel_id: hotelId,
    },
  });
};
