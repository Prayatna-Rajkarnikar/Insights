import { Router } from "express";
import cors from "cors";
import {
  getTotalUsers,
  toggleUserStatus,
  getUserList,
  getTotalBlogs,
  getBlogList,
} from "../controllers/adminController.js";

const router = Router();
router.use(cors({ credentials: true, origin: "http://localhost:5173" }));
router.get("/getTotalUser", getTotalUsers);
router.patch("/toggleUserStatus", toggleUserStatus);
router.get("/getUserList", getUserList);
router.get("/getTotalBlogs", getTotalBlogs);
router.get("/getBlogList", getBlogList);

export default router;
