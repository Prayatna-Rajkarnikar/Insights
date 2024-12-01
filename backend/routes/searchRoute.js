import { Router } from "express";
import { searchTopic, searchBlogs } from "../controllers/searchController.js";

const router = Router();

router.get("/searchTopic", searchTopic);
router.get("/searchBlogs", searchBlogs);

export default router;
