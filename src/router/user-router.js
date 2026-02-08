import express from "express";
import * as userController from "../controllers/user-controller.js";
import { authMiddleware } from "../middleware/auth_middleware.js";

const userRouter = express.Router();

userRouter.get("/profile", authMiddleware, userController.profile);

export default userRouter;