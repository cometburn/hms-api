import prisma from "@/helpers/prisma.helper";

export class DashboardRepository {
    /**
     * Get Dashboard Rooms
     * @param hotelId
     * @returns
     */
    getDashboardRooms = async (hotelId: number) => {
        return await prisma.room.findMany({
            where: {
                hotel_id: hotelId,
                operational_status: "available",
            },
            orderBy: { name: "asc" },
            include: {
                room_type: true,
                bookings: {
                    where: {
                        hotel_id: hotelId,
                        status: { equals: "check_in" },
                    },
                    include: {
                        booking_addons: {
                            include: {
                                product: {
                                    select: {
                                        name: true,
                                        sku: true,
                                        category: true,
                                    },
                                },
                            },
                        },
                        orders: true,
                        room_rate: true,
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                email: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });
    };
}
