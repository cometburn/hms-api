import prisma from "@/helpers/prisma.helper";
import { RoomPromo } from "@prisma/client";

export const getRoomPromos = async (
  hotelId: number,
  search: string,
  skip: number,
  limit: number
) => {
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

export const createRoomPromoRepository = async (data: RoomPromo) => {
  return await prisma.roomPromo.create({ data });
};

export async function updateRoomPromoRepository(
  hotelId: number,
  id: number,
  data: Partial<RoomPromo>
) {
  return prisma.roomPromo.update({
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
export const deleteRoomPromoRepository = async (
  hotelId: number,
  id: number
) => {
  return prisma.roomPromo.delete({
    where: {
      id,
      hotel_id: hotelId,
    },
  });
};
