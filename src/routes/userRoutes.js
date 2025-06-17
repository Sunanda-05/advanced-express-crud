import { Router } from "express";
import getUserProfile, { getUserIdByEmail } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router({ mergeParams: true });

router.get("/", authMiddleware, getUserProfile);
router.get("/userId", getUserIdByEmail);

export default router;
