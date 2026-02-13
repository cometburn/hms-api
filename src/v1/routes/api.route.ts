import { Router } from "express";
import authRoute from "@/routes/auth.route";
import hotelRoute from "@/routes/hotel.route";
import userRoute from "@/routes/user.route";

import roomTypeRoute from "@/routes/roomType.route";
import roomRateRoute from "@/routes/roomRate.route";
import roomPromoRoute from "@/routes/roomPromo.route";
import roomRoute from "@/routes/room.route";
import bookingRoute from "@/routes/booking.route";
import dashboardRoute from "@/routes/dashboard.route";

import { protect } from "@/middlewares/auth.middleware";

const apiRoute = Router();
const routeVersion = "v1";


apiRoute.use(`/${routeVersion}/auth`, authRoute);
apiRoute.use(`/${routeVersion}/hotels`, protect, hotelRoute);
apiRoute.use(`/${routeVersion}/rooms`, protect, roomRoute);
apiRoute.use(`/${routeVersion}/bookings`, protect, bookingRoute);
apiRoute.use(`/${routeVersion}/dashboard`, protect, dashboardRoute);
apiRoute.use(`/${routeVersion}/room-types`, protect, roomTypeRoute);
apiRoute.use(`/${routeVersion}/room-rates`, protect, roomRateRoute);
apiRoute.use(`/${routeVersion}/room-promos`, protect, roomPromoRoute);
apiRoute.use(`/${routeVersion}/users`, protect, userRoute);

export default apiRoute;
