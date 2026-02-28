import prisma from "@/helpers/prisma.helper";
import { HotelRepository } from "@/repositories/hotel.repository";
import { createUserHotelLink } from "@/repositories/userHotel.repository";
import { UserRepository } from "@/repositories/user.repository";

export class HotelService {
    private userRepository: UserRepository;
    private hotelRepository: HotelRepository;
    constructor() {
        this.userRepository = new UserRepository();
        this.hotelRepository = new HotelRepository();
    }

    /**
     * Creates a hotel
     * @param userId
     * @param data
     * @returns
     */
    createHotelService = async (userId: number, data: any) => {
        const hotel = await prisma.$transaction(async (tx) => {
            const newHotel = await this.hotelRepository.createHotel(data);
            const existing = await this.userRepository.getUserHotels(userId);

            await createUserHotelLink(userId, newHotel.id, existing.length === 0);
            return newHotel;
        });

        return hotel;
    };
}
