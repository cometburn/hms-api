import { RoomPromo } from "@prisma/client";
import {
  getRoomPromos,
  countRoomPromos,
  createRoomPromoRepository,
  updateRoomPromoRepository,
  deleteRoomPromoRepository,
} from "@/repositories/roomPromo.repository";
import { RequestParams } from "@/interfaces"

/**
 * Get all room promos service
 * @param hotelId
 * @param page
 * @param limit
 * @param search
 * @returns all room promos
 */
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

/**
 * Create room promo service
 * @param hotelId
 * @param data
 * @returns created room promo
 */
export const createRoomPromoService = async (hotelId: number, data: any) => {
  return await createRoomPromoRepository({
    ...data,
    hotel_id: hotelId,
  });
};

/**
 * Update room promo service
 * @param hotelId
 * @param id
 * @param data
 * @returns updated room promo
 */
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
