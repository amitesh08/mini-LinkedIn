import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getUserPosts,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isPostAuthor } from "../middleware/postMiddleware.js";

const router = express.Router();

router.post("/create", protect, createPost); // Protected
router.get("/feed", getAllPosts); // Public
router.get("/user/:id", getUserPosts); // Public
router.delete("/:id", protect, isPostAuthor, deletePost); // Protected + Ownership checked

export default router;
