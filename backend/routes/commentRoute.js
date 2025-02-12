import { Router } from "express";
import {
  getComments,
  createComment,
  getTotalComments,
} from "../controllers/commentController.js";
import { sendEmail } from "../middlewares/emailService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
router.post("/createComment", authMiddleware, createComment);
router.get("/getcomments/:blogId", authMiddleware, getComments);
router.get("/getTotalComments/:blogId", authMiddleware, getTotalComments);
router.post("/sendEmail", sendEmail);

export default router;
