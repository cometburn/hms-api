import { RoomType } from "@prisma/client";
import {
  getRoomTypes,
  countRoomTypes,
  createRoomTypeRepository,
  updateRoomTypeRepository,
  deleteRoomTypeRepository,
} from "@/repositories/roomType.repository";
import { GetAllRoomTypesParams } from "@/interfaces";

/**
 * Gets all room types
 * @param param0
 * @returns paginated room types
 */
export const getAllRoomTypesService = async ({
  hotelId,
  page,
  limit,
  search,
}: GetAllRoomTypesParams) => {
  const skip = page > 0 && limit > 0 ? (page - 1) * limit : undefined;
  const take = limit > 0 ? limit : undefined;

  const [data, total] = await Promise.all([
    getRoomTypes(hotelId, search, skip, take),
    countRoomTypes(hotelId, search),
  ]);

  const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

  return {
    data,
    meta: {
      total,
      page: page || 1,
      limit: limit || total,
      totalPages,
    },
  };
};

/**
 * Creates room type
 * @param hotelId
 * @param data
 * @return created room type
 */
export const createRoomTypeService = async (hotelId: number, data: any) => {
  return await createRoomTypeRepository({
    ...data,
    hotel_id: hotelId,
  });
};

/**
 * Update room type service
 * @param hotelId
 * @param id
 * @param data
 * @returns updated room type
 */
export async function updateRoomTypeService(
  hotelId: number,
  id: number,
  data: Partial<RoomType>
) {
  return await updateRoomTypeRepository(hotelId, id, data);
}

/**
 * Delete room type service
 * @param hotelId
 * @param id
 * @returns deleted room type
 */
export const deleteRoomTypeService = async (hotelId: number, id: number) => {
  return await deleteRoomTypeRepository(hotelId, id);
};
