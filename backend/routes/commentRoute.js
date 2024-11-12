import express from "express";
import {
  getComments,
  createComment,
  getTotalComments,
} from "../controllers/commentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/createComment", authMiddleware, createComment);
// router.post("/submit", submitComment);
router.get("/getcomments/:blogId", authMiddleware, getComments);
router.get("/getTotalComments/:blogId", authMiddleware, getTotalComments);

export default router;
