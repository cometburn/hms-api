import prisma from "@/helpers/prisma.helper";
import { getLocalDateAndTime } from "@/utils/date.utils";

export const getDashboardRooms = async (
    hotelId: number
) => {
    const now = new Date();
    return await prisma.room.findMany({
        where: {
            hotel_id: hotelId,
            operational_status: 'available'
        },
        orderBy: { name: "asc" },
        include: {
            room_type: true,
            bookings: {
                where: {
                    hotel_id: hotelId,
                    // start_datetime: { lte: now },  // Started before or at now
                    // end_datetime: { gte: now },    // Ends after or at now
                    status: { equals: "check_in", }
                },
                include: {
                    booking_addons: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    sku: true,
                                    category: true,
                                }
                            }
                        }
                    },
                    room_rate: true,
                    user: {
                        select: {
                            first_name: true,
                            last_name: true,
                            email: true,
                            avatar: true
                        }
                    }
                }
            }
        },
    });
};
