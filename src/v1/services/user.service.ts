import { switchUserHotel as switchUserHotelRepo } from "@/repositories/userHotel.repository";

/**
 * Switches user default hotel
 */
export const switchUserHotel = async (userId: number, hotelId: number) => {
    await switchUserHotelRepo(userId, hotelId);
    return { message: "User Hotel switched" };
};