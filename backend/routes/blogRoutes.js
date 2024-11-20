import { Router } from "express";
import {
  createBlog,
  editBlog,
  homeBlogs,
  userBlogs,
  blogDetail,
  deleteBlog,
} from "../controllers/blogController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/imgMiddleware.js";
import cors from "cors";

const router = Router();
router.use(cors({ credentials: true, origin: "http://localhost:3000" }));

router.post("/createBlog", authMiddleware, upload.array("image"), createBlog);
router.put("/editBlog/:id", authMiddleware, upload.array("image"), editBlog);
router.get("/getBlogs", homeBlogs);
router.get("/getUserBlogs", authMiddleware, userBlogs);
router.get("/getBlogDetail/:id", authMiddleware, blogDetail);
router.delete("/deleteBlog/:blogId", deleteBlog);

export default router;
