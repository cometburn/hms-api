import { Router } from "express";
import { getDashboardRooms } from "@/controllers/dashboard.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/dashboard:
 *   get:
 *     summary: Get all dashboard rooms
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Limit per page
 *     responses:
 *       200:
 *         description: A list of dashboard rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       format: int32
 *                     page:
 *                       type: integer
 *                       format: int32
 *                     limit:
 *                       type: integer
 *                       format: int32
 *                     totalPages:
 *                       type: integer
 *                       format: int32
 */
router.get("/", getDashboardRooms);

export default router;
