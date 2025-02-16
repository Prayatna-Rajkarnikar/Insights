import { Router } from "express";

import {
  addTopic,
  getMostUsedTopics,
} from "../controllers/topicsController.js";

const router = Router();

router.post("/addTopic", addTopic);
router.get("/getMostUsedTopics", getMostUsedTopics);

export default router;
