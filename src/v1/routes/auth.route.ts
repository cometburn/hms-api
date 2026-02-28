import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { protect } from "@/middlewares/auth.middleware";
import { withValidation } from "@/middlewares/validation.middleware";
import { loginSchema } from "@/interfaces/types/auth.types";

const router = Router();
const controller = new AuthController();

router.post("/login", withValidation(loginSchema, controller.login));
router.post("/logout", protect, controller.logout);
router.post("/refresh", controller.refreshToken);
router.get("/me", protect, controller.me);
router.post("/google", controller.googleLogin);

export default router;
