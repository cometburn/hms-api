import { RoomRate } from "@prisma/client";
import {
  getRoomRates,
  countRoomRates,
  createRoomRateRepository,
  updateRoomRateRepository,
  deleteRoomRateRepository,
} from "@/repositories/roomRate.repository";

import { RequestParams } from "@/interfaces";

export const getAllRoomRatesService = async ({
  hotelId,
  page,
  limit,
  search,
}: RequestParams) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    getRoomRates(hotelId, search, skip, limit),
    countRoomRates(hotelId, search),
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

export const createRoomRateService = async (hotelId: number, data: any) => {
  return await createRoomRateRepository({
    ...data,
    hotel_id: hotelId,
  });
};

export const updateRoomRateService = async (
  hotelId: number,
  id: number,
  data: Partial<RoomRate>
) => {
  return await updateRoomRateRepository(hotelId, id, data);
}

/**
 * Delete room type service
 * @param hotelId
 * @param id
 * @returns deleted room type
 */
export const deleteRoomRateService = async (hotelId: number, id: number) => {
  return await deleteRoomRateRepository(hotelId, id);
};
