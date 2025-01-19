import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import cors from "cors";

import {
  registerUser,
  loginUser,
  forgetPassword,
  logout,
  validDetails,
} from "../controllers/authController.js";

const router = Router();
router.use(cors({ credentials: true, origin: "http://localhost:5173" }));
router.post("/register", registerUser);
router.post("/validDetails", validDetails);
router.post("/login", loginUser);
router.put("/forgetPassword", forgetPassword);
router.post("/logout", authMiddleware, logout);

export default router;
