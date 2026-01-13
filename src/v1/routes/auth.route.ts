import { Router } from "express";
import {
  login,
  refreshToken,
  me,
  logout,
  googleLogin,
} from "@/controllers/auth.controller";
import { protect } from "@/middlewares/auth.middleware";

import { loginSchema } from "@/interfaces/types/auth";
import { withValidation } from "@/middlewares/validation.middleware";

const authRoute = Router();

authRoute.post("/login", withValidation(loginSchema, login));
authRoute.post("/logout", protect, logout);
authRoute.post("/refresh-token", refreshToken);
authRoute.get("/me", protect, me);
authRoute.post("/google", googleLogin);

export default authRoute;
