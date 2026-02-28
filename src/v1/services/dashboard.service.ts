import { DashboardRepository } from "@/repositories/dashboard.repository";

export class DashboardService {
    private dashboardRepository: DashboardRepository;
    constructor() {
        this.dashboardRepository = new DashboardRepository();
    }
    getDashboardRooms = async (hotelId: number) => {
        return await this.dashboardRepository.getDashboardRooms(hotelId);
    };
}
