import { RoomPromo } from "@prisma/client";
import { RoomPromoRepository } from "@/repositories/roomPromo.repository";
import { RequestParams } from "@/interfaces";

export class RoomPromoService {
    private roomPromoRepository: RoomPromoRepository;
    constructor() {
        this.roomPromoRepository = new RoomPromoRepository();
    }

    /**
     * Get all room promos
     * @param hotelId
     * @param page
     * @param limit
     * @param search
     * @returns all room promos
     */
    getAllRoomPromos = async ({ hotelId, page, limit, search }: RequestParams) => {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.roomPromoRepository.getRoomPromos(hotelId, search, skip, limit),
            this.roomPromoRepository.countRoomPromos(hotelId, search),
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
     * Create room promo
     * @param hotelId
     * @param data
     * @returns created room promo
     */
    createRoomPromo = async (hotelId: number, data: any) => {
        return await this.roomPromoRepository.createRoomPromo({
            ...data,
            hotel_id: hotelId,
        });
    };

    /**
     * Update room promo
     * @param hotelId
     * @param id
     * @param data
     * @returns updated room promo
     */
    updateRoomPromo = async (hotelId: number, id: number, data: Partial<RoomPromo>) => {
        return await this.roomPromoRepository.updateRoomPromo(hotelId, id, data);
    };

    /**
     * Delete room type
     * @param hotelId
     * @param id
     * @returns deleted room type
     */
    deleteRoomPromo = async (hotelId: number, id: number) => {
        return await this.roomPromoRepository.deleteRoomPromo(hotelId, id);
    };
}
