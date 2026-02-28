import prisma from "@/helpers/prisma.helper";
import { Hotel } from "@prisma/client";

export class HotelRepository {
    /** Creates a hotel */
    createHotel = (data: Hotel) => {
        return prisma.hotel.create({ data });
    };
}
