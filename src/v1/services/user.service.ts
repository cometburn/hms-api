import { Prisma } from "@prisma/client";
import { switchUserHotel } from "@/repositories/userHotel.repository";
import { BadRequestError } from "@/helpers/error.helper";

export const createRoomTypeService = async (
  userId: number,
  hotelId: number,
  data: any
) => {
  await switchUserHotel(userId, hotelId);
  return { message: "User Hotel switched" };
};
