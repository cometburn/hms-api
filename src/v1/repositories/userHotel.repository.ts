import prisma from "@/helpers/prisma.helper";
/**
 * Create User Hotel
 * @param userId
 * @param hotelId
 * @param isDefault
 */
export const createUserHotelLink = async (
  userId: number,
  hotelId: number,
  isDefault: boolean
) => {
  return await prisma.userHotel.create({
    data: { user_id: userId, hotel_id: hotelId, is_default: isDefault },
  });
};

/**
 * Updatees User Default hotel
 * @param userId
 * @param hotelId
 * @returns
 */
export const switchUserHotel = async (userId: number, hotelId: number) => {
  return await prisma.$transaction(async (tx) => {
    await tx.userHotel.updateMany({
      where: { user_id: userId },
      data: { is_default: false },
    });

    return await tx.userHotel.updateMany({
      where: { user_id: userId, hotel_id: hotelId },
      data: { is_default: true },
    });
  });
};
