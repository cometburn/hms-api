import prisma from "@/helpers/prisma.helper";
import { RoomType } from "@prisma/client";

/**
 * Gets room types
 * @param hotelId
 * @param search
 * @param skip
 * @param take
 * @returns paginated room types
 */
export const getRoomTypes = async (
  hotelId: number,
  search: string,
  skip?: number,
  take?: number
) => {
  return await prisma.roomType.findMany({
    where: {
      hotel_id: hotelId,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy: { created_at: "asc" },
    ...(skip !== undefined && { skip }),
    ...(take !== undefined && { take }),
  });
};

/**
 * Count room types
 * @param hotelId
 * @param search
 * @returns counted rows
 */
export const countRoomTypes = async (hotelId: number, search: string) => {
  return await prisma.roomType.count({
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
 * Creates room types
 * @param data
 * @returns created room type
 */
export const createRoomTypeRepository = async (data: any) => {
  return await prisma.roomType.create({ data });
};

/**
 * Updates room types
 * @param hotelId
 * @param id
 * @param data
 * @returns updated room type
 */
export async function updateRoomTypeRepository(
  hotelId: number,
  id: number,
  data: Partial<RoomType>
) {
  return prisma.roomType.update({
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
export const deleteRoomTypeRepository = async (hotelId: number, id: number) => {
  return prisma.roomType.delete({
    where: {
      id,
      hotel_id: hotelId,
    },
  });
};
