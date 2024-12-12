import { Router } from "express";
import {
  searchTopic,
  searchBlogs,
  searchUsers,
} from "../controllers/searchController.js";

const router = Router();

router.get("/searchTopic", searchTopic);
router.get("/searchBlogs", searchBlogs);
router.get("/searchUsers", searchUsers);

export default router;
