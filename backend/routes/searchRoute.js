import { Router } from "express";
import {
  searchTopic,
  searchBlogs,
  searchUsers,
  searchAllChat,
  searchUserChat,
} from "../controllers/searchController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/searchTopic", searchTopic);
router.get("/searchBlogs", searchBlogs);
router.get("/searchUsers", authMiddleware, searchUsers);
router.get("/searchAllChat", authMiddleware, searchAllChat);
router.get("/searchUserChat", authMiddleware, searchUserChat);

export default router;
