import { RoomPromo } from "@prisma/client";
import {
  getRoomPromos,
  countRoomPromos,
  createRoomPromoRepository,
  updateRoomPromoRepository,
  deleteRoomPromoRepository,
} from "@/repositories/roomPromo.repository";

interface GetAllRoomPromosParams {
  hotelId: number;
  page: number;
  limit: number;
  search: string;
}

export const getAllRoomPromosService = async ({
  hotelId,
  page,
  limit,
  search,
}: GetAllRoomPromosParams) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    getRoomPromos(hotelId, search, skip, limit),
    countRoomPromos(hotelId, search),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

export const createRoomPromoService = async (hotelId: number, data: any) => {
  return await createRoomPromoRepository({
    ...data,
    hotel_id: hotelId,
  });
};

export async function updateRoomPromoService(
  hotelId: number,
  id: number,
  data: Partial<RoomPromo>
) {
  return await updateRoomPromoRepository(hotelId, id, data);
}

/**
 * Delete room type service
 * @param hotelId
 * @param id
 * @returns deleted room type
 */
export const deleteRoomPromoService = async (hotelId: number, id: number) => {
  return await deleteRoomPromoRepository(hotelId, id);
};
