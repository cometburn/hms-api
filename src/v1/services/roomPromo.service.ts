import { RoomPromo } from "@prisma/client";
import {
  getRoomPromos,
  countRoomPromos,
  createRoomPromoRepository,
  updateRoomPromoRepository,
  deleteRoomPromoRepository,
} from "@/repositories/roomPromo.repository";
import { RequestParams } from "@/interfaces"

export const getAllRoomPromosService = async ({
  hotelId,
  page,
  limit,
  search,
}: RequestParams) => {
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

export const updateRoomPromoService = async (
  hotelId: number,
  id: number,
  data: Partial<RoomPromo>
) => {
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
