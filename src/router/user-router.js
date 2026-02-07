import express from "express";
import * as userController from "../controllers/user-controller.js";
import { authMiddleware } from "../middleware/auth_middleware.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management API
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.get("/profile", authMiddleware, userController.profile);

export default userRouter;