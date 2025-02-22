import { Router } from "express";
import {
  addSlangWord,
  deleteWords,
  getTotalWords,
  getSlangwordList,
} from "../controllers/slangwordController.js";

const router = Router();

router.post("/addSlangword", addSlangWord);
router.post("/deleteWords", deleteWords);
router.get("/getTotalWords", getTotalWords);
router.get("/getSlangwordList", getSlangwordList);

export default router;
