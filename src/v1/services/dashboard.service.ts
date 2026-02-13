import { getDashboardRooms } from "@/repositories/dashboard.repository";

export const getDashboardRoomsService = async (
    hotelId: number
) => {
    const date = new Date();
    const validDate = isNaN(date.getTime()) ? new Date() : date;

    return await getDashboardRooms(hotelId, validDate);
};
