import prisma from "@/helpers/prisma.helper";
import { RoomRate, RoomType } from "@prisma/client";

/**
 * Gets all room rates
 * @param hotelId
 * @param search
 * @param skip
 * @param limit
 * @returns
 */
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

/**
 * Updates room rate
 * @param hotelId
 * @param id
 * @param data
 * @returns
 */
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

/**
 * Gets room rates by room type id
 * @param hotelId
 * @param roomTypeId
 * @returns
 */
export const getRoomRatesByRoomTypeIdRepository = async (
  hotelId: number,
  roomTypeId: number
) => {
  return await prisma.roomRate.findMany({
    where: {
      hotel_id: hotelId,
      room_type_id: roomTypeId,
    },
  });
};
