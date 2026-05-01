import prisma from "@/helpers/prisma.helper";
import { Hotel } from "@prisma/client";

/** Creates a hotel */
export const createHotel = (data: Hotel) => {
    return prisma.hotel.create({ data });
};
