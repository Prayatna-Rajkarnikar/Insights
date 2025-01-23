import { Router } from "express";
import {
  getTotalUsers,
  deactivateUser,
  getUserList,
  getTotalBlogs,
  getBlogList,
} from "../controllers/adminController.js";

const router = Router();
router.get("/getTotalUser", getTotalUsers);
router.patch("/deactivateUser", deactivateUser); //Updates only the specified fields.
router.get("/getUserList", getUserList);
router.get("/getTotalBlogs", getTotalBlogs);
router.get("/getBlogList", getBlogList);

export default router;
