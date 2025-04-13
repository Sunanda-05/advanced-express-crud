import { Router } from "express";
import getUserProfile from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router({ mergeParams: true });

router.get("/", authMiddleware, getUserProfile);

export default router;
