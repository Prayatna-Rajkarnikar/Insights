import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { flagComment } from "../controllers/flagController.js";

const router = Router();
router.post("/flagComment", authMiddleware, flagComment);

export default router;
