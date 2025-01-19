import { Router } from "express";
import {
  getUserNumbers,
  deleteUser,
  getUserList,
} from "../controllers/adminController.js";

const router = Router();
router.get("/getTotalUser", getUserNumbers);
router.delete("/deleteUser", deleteUser);
router.get("/getUserList", getUserList);

export default router;
