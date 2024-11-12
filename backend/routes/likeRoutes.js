import { Router } from "express";
import {
  toggleLike,
  getUserLikes,
  getTotalLikes,
} from "../controllers/likeController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
router.post("/toggleLike/:blogId", authMiddleware, toggleLike);
router.get("/getUserLike/:blogId", authMiddleware, getUserLikes);
router.get("/getTotalLikes/:blogId", authMiddleware, getTotalLikes);

export default router;
