import prisma from "@/helpers/prisma.helper";

export const getDashboardRooms = async (
    hotelId: number,
    date: Date,
) => {
    return await prisma.room.findMany({
        where: {
            hotel_id: hotelId,
        },
        orderBy: { name: "asc" },
        include: {
            room_type: true,
            bookings: {
                where: {
                    start_time: { lte: date },
                    end_time: { gte: date },
                    status: { not: "cancelled" }
                },
                include: {
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
