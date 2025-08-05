import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

export default router;
