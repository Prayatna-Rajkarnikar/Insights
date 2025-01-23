import { Router } from "express";
import {
  addSlangWord,
  deleteWords,
  getTotalWords,
} from "../controllers/slangwordController.js";

const router = Router();

router.post("/addSlangword", addSlangWord);
router.post("/deleteWords", deleteWords);
router.post("/getTotalWords", getTotalWords);

export default router;
