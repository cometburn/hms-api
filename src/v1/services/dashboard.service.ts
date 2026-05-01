import { getDashboardRooms as getDashboardRoomsRepo } from "@/repositories/dashboard.repository";

/**
 * Get Dashboard Rooms
 * @param hotelId 
 * @returns 
 */
export const getDashboardRooms = async (hotelId: number) => {
    return await getDashboardRoomsRepo(hotelId);
};