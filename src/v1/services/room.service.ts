import { Room } from "@prisma/client";
import { RoomRepository } from "@/repositories/room.repository";
import { RequestParams } from "@/interfaces";

export class RoomService {
    private roomRepository: RoomRepository;

    constructor() {
        this.roomRepository = new RoomRepository();
    }
    /**
     * Gets all rooms
     * @param hotelId
     * @param page
     * @param limit
     * @param search
     * @returns
     */
    getAllRooms = async ({ hotelId, page, limit, search }: RequestParams) => {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.roomRepository.getRooms(hotelId, search, skip, limit),
            this.roomRepository.countRooms(hotelId, search),
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
     * Gets all rooms by room type id
     * @param roomTypeId
     * @returns
     */
    getRoomsByRoomTypeId = async (roomTypeId: number) => {
        return await this.roomRepository.getRoomsByRoomTypeId(roomTypeId);
    };

    /**
     * Gets all rooms by room type id
     * @param roomTypeId
     * @returns
     */
    getAvailableRoomsByRoomTypeId = async (hotelId: number, roomTypeId: number) => {
        return await this.roomRepository.getAvailableRoomsByRoomTypeId(hotelId, roomTypeId);
    };

    /**
     * Creates a room
     * @param hotelId
     * @param data
     * @returns created room
     */
    createRoom = async (hotelId: number, data: any) => {
        return await this.roomRepository.createRoomRepository({
            ...data,
            hotel_id: hotelId,
        });
    };

    /**
     * Updates a room
     * @param hotelId
     * @param id
     * @param data
     * @returns updated room
     */
    updateRoom = async (hotelId: number, id: number, data: Partial<Room>) => {
        return await this.roomRepository.updateRoomRepository(hotelId, id, data);
    };

    /**
     * Delete room type
     * @param hotelId
     * @param id
     * @returns deleted room type
     */
    deleteRoom = async (hotelId: number, id: number) => {
        return await this.roomRepository.deleteRoomRepository(hotelId, id);
    };
}
