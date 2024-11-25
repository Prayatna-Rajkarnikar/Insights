import { Router } from "express";
import { searchTopic } from "../controllers/searchController.js";

const router = Router();

router.get("/searchTopic", searchTopic);

export default router;
