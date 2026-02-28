import { RoomRate } from "@prisma/client";
import { RoomRateRepository } from "@/repositories/roomRate.repository";

import { RequestParams } from "@/interfaces";

export class RoomRateService {
    private roomRateRepository: RoomRateRepository;
    constructor() {
        this.roomRateRepository = new RoomRateRepository();
    }

    /**
     * Gets all room rates service
     * @param hotelId
     * @param page
     * @param limit
     * @param search
     * @returns
     */
    getAllRoomRatesService = async ({ hotelId, page, limit, search }: RequestParams) => {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.roomRateRepository.getRoomRates(hotelId, search, skip, limit),
            this.roomRateRepository.countRoomRates(hotelId, search),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    };

    /**
     * Creates a room rate service
     * @param hotelId
     * @param data
     * @returns
     */
    createRoomRateService = async (hotelId: number, data: any) => {
        return await this.roomRateRepository.createRoomRateRepository({
            ...data,
            hotel_id: hotelId,
        });
    };

    /**
     * Updates room rate service
     * @param hotelId
     * @param id
     * @param data
     * @returns
     */
    updateRoomRateService = async (hotelId: number, id: number, data: Partial<RoomRate>) => {
        return await this.roomRateRepository.updateRoomRateRepository(hotelId, id, data);
    };

    /**
     * Delete room type service
     * @param hotelId
     * @param id
     * @returns deleted room type
     */
    deleteRoomRateService = async (hotelId: number, id: number) => {
        return await this.roomRateRepository.deleteRoomRateRepository(hotelId, id);
    };

    getRoomRatesByRoomTypeIdService = async (hotelId: number, roomTypeId: number) => {
        return await this.roomRateRepository.getRoomRatesByRoomTypeIdRepository(
            hotelId,
            roomTypeId
        );
    };
}
