import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
} from "../controllers/authController.js";
const router = Router({ mergeParams: true });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshTokens);

export default router;
