import { RoomType } from "@prisma/client";
import { RoomTypeRepository } from "@/repositories/roomType.repository";
import { RequestParams } from "@/interfaces";

export class RoomTypeService {
    private roomTypeRepository: RoomTypeRepository;
    constructor() {
        this.roomTypeRepository = new RoomTypeRepository();
    }

    /**
     * Gets all room types
     * @param  hotelId
     * @param  page
     * @param  limit
     * @param  search
     * @returns
     */
    getAllRoomTypes = async ({ hotelId, page, limit, search }: RequestParams) => {
        const skip = page > 0 && limit > 0 ? (page - 1) * limit : undefined;
        const take = limit > 0 ? limit : undefined;

        const [data, total] = await Promise.all([
            this.roomTypeRepository.getRoomTypes(hotelId, search, skip, take),
            this.roomTypeRepository.countRoomTypes(hotelId, search),
        ]);

        const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

        return {
            data,
            meta: {
                total,
                page: page || 1,
                limit: limit || total,
                totalPages,
            },
        };
    };

    /**
     * Creates room type
     * @param hotelId
     * @param data
     * @return created room type
     */
    createRoomType = async (hotelId: number, data: any) => {
        return await this.roomTypeRepository.createRoomType({
            ...data,
            hotel_id: hotelId,
        });
    };

    /**
     * Update room type
     * @param hotelId
     * @param id
     * @param data
     * @returns updated room type
     */
    updateRoomType = async (hotelId: number, id: number, data: Partial<RoomType>) => {
        return await this.roomTypeRepository.updateRoomType(hotelId, id, data);
    };

    /**
     * Delete room type
     * @param hotelId
     * @param id
     * @returns deleted room type
     */
    deleteRoomType = async (hotelId: number, id: number) => {
        return await this.roomTypeRepository.deleteRoomType(hotelId, id);
    };
}
