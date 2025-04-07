import { Router } from "express";
import {
  createRoom,
  getAllRooms,
  getUserRooms,
  joinRoom,
} from "../controllers/roomController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/createRoom", authMiddleware, createRoom);
router.get("/getUserRooms", authMiddleware, getUserRooms);
router.get("/getAllRooms", authMiddleware, getAllRooms);
router.put("/joinRoom/:roomId", authMiddleware, joinRoom);

export default router;
