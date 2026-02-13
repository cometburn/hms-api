import { Router } from "express";
import { getDashboardRooms } from "@/controllers/dashboard.controller";

const dashboardRoute = Router();

dashboardRoute.get("/", getDashboardRooms);

export default dashboardRoute;
