import prisma from "@/helpers/prisma.helper";
import { Booking } from "@prisma/client";

export const getBookings = async (
    hotelId: number,
    search: string,
    skip: number,
    limit: number
) => {
    return await prisma.booking.findMany({
        where: {
            hotel_id: hotelId,
        },
        orderBy: {
            room: {
                name: "asc"
            }
        },
        skip,
        take: limit,
        include: {
            room: true
        },
    });
};

export const countBookings = async (hotelId: number, search: string) => {
    return await prisma.booking.count({
        where: {
            hotel_id: hotelId,
        },
    });
};

export const createBookingRepository = async (data: any) => {
    return await prisma.booking.create({ data });
};

export const updateBookingRepository = async (
    hotelId: number,
    id: number,
    data: Partial<Booking>
) => {
    return prisma.booking.update({
        where: { id, hotel_id: hotelId },
        data,
    });
}

/**
 * Deletes a Booking
 * @param hotelId
 * @param id
 * @returns
 */
export const deleteBookingRepository = async (hotelId: number, id: number) => {
    return prisma.booking.delete({
        where: {
            id,
            hotel_id: hotelId,
        },
    });
};
