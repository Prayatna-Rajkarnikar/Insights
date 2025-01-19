import { Router } from "express";
import upload from "../middlewares/imgMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getUserInfo, editProfile } from "../controllers/userController.js";

const router = Router();
router.get("/profile", authMiddleware, getUserInfo);
router.put(
  "/updateProfile",
  authMiddleware,
  upload.single("image"),
  editProfile
);

export default router;
