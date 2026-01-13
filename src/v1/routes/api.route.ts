import { Router } from "express";
import authRoute from "@/routes/auth.route";
import hotelRoute from "@/routes/hotel.route";
import userRoute from "@/routes/user.route";

import roomTypeRoute from "@/routes/roomType.route";
import roomRateRoute from "@/routes/roomRate.route";
import roomPromoRoute from "@/routes/roomPromo.route";
import { protect } from "@/middlewares/auth.middleware";

const apiRoute = Router();

apiRoute.use("/auth", authRoute);
apiRoute.use("/hotels", protect, hotelRoute);
apiRoute.use("/room-types", protect, roomTypeRoute);
apiRoute.use("/room-rates", protect, roomRateRoute);
apiRoute.use("/room-promos", protect, roomPromoRoute);
apiRoute.use("/users", protect, userRoute);

export default apiRoute;
