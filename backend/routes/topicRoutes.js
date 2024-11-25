import { Router } from "express";

import { addTopic } from "../controllers/topicsController.js";

const router = Router();

router.post("/addTopic", addTopic);

export default router;
