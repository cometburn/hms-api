import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { protect } from "@/middlewares/auth.middleware";
import { withValidation } from "@/middlewares/validation.middleware";
import { loginSchema } from "@/interfaces/types/auth.types";

const router = Router();
const controller = new AuthController();

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     user:
 *                       $ref: "#/components/schemas/User"
 */
router.post("/login", withValidation(loginSchema, controller.login));

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 */
router.post("/logout", protect, controller.logout);

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 */
router.post("/refresh", controller.refreshToken);

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: "#/components/schemas/User"
 */
router.get("/me", protect, controller.me);

/**
 * @openapi
 * /api/v1/auth/google:
 *   post:
 *     summary: Google login
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     user:
 *                       $ref: "#/components/schemas/User"
 */
router.post("/google", controller.googleLogin);

export default router;
