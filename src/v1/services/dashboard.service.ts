import { getDashboardRooms } from "@/repositories/dashboard.repository";

export const getDashboardRoomsService = async (
    hotelId: number
) => {
    return await getDashboardRooms(hotelId);
};
