import { Router } from "express";
import {
  createBlog,
  editBlog,
  getLatestBlogs,
  userBlogs,
  userBlogsById,
  getBlogDetail,
  deleteBlog,
  getTrendingBlogs,
} from "../controllers/blogController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/imgMiddleware.js";
import cors from "cors";

const router = Router();
router.use(cors({ credentials: true, origin: "http://localhost:5173" }));

router.post("/createBlog", authMiddleware, upload.array("image"), createBlog);
router.put("/editBlog/:id", authMiddleware, upload.array("image"), editBlog);
router.get("/getLatestBlogs", getLatestBlogs);
router.get("/getUserBlogs", authMiddleware, userBlogs);
router.get("/getUserBlogsById/:userId", userBlogsById);
router.get("/getBlogDetail/:id", authMiddleware, getBlogDetail);
router.delete("/deleteBlog/:blogId", deleteBlog);
router.get("/trending", getTrendingBlogs);

export default router;
