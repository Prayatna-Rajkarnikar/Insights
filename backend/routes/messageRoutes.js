import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = Router();
router.post("/sendMessage/:roomId", authMiddleware, sendMessage);
router.get("/getMessages/:roomId", authMiddleware, getMessages);

export default router;
