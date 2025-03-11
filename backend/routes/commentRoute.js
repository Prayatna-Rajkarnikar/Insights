import { Router } from "express";
import {
  getComments,
  createComment,
  getTotalComments,
  hideComment,
} from "../controllers/commentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
router.post("/createComment", authMiddleware, createComment);
router.get("/getcomments/:blogId", authMiddleware, getComments);
router.get("/getTotalComments/:blogId", authMiddleware, getTotalComments);
router.patch("/hideComment/:id", authMiddleware, hideComment);

export default router;
