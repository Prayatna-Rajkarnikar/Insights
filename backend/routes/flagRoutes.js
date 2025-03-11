import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { flagComment } from "../controllers/flagController.js";
import { sendUserDeactivateEmail } from "../middlewares/emailService.js";

const router = Router();
router.post("/flagComment/:id", authMiddleware, flagComment);
router.post("/sendEmail", sendUserDeactivateEmail);

export default router;
