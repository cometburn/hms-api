import { Prisma } from "@prisma/client";
import { UserHotelRepository } from "@/repositories/userHotel.repository";
import { BadRequestError } from "@/helpers/error.helper";

export class UserService {
    private userHotelRepository: UserHotelRepository;
    constructor() {
        this.userHotelRepository = new UserHotelRepository();
    }

    /**
     * Switches user default hotel
     */
    switchUserHotel = async (userId: number, hotelId: number) => {
        await this.userHotelRepository.switchUserHotel(userId, hotelId);
        return { message: "User Hotel switched" };
    };
}
