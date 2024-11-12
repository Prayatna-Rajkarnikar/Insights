import { Router } from "express";
import upload from "../middlewares/imgMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import cors from "cors";

import {
  registerUser,
  loginUser,
  getUser,
  getUserNumbers,
  logout,
  getUserList,
  deleteUser,
  editProfile,
} from "../controllers/authController.js";

const router = Router();
router.use(cors({ credentials: true, origin: "http://localhost:3000" }));
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUser);
router.post("/logout", authMiddleware, logout);
router.get("/getTotalUser", getUserNumbers);
router.get("/getUserList", getUserList);
router.delete("/deleteUser", deleteUser);
router.put(
  "/updateProfile",
  authMiddleware,
  upload.single("image"),
  editProfile
);

export default router;
