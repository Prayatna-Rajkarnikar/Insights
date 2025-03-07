import { Router } from "express";
import {
  addSlangWord,
  deleteSlangword,
  getTotalWords,
  getSlangwordList,
  searchSlangword,
} from "../controllers/slangwordController.js";

const router = Router();

router.post("/addSlangword", addSlangWord);
router.delete("/deleteSlangword", deleteSlangword);
router.get("/getTotalWords", getTotalWords);
router.get("/getSlangwordList", getSlangwordList);
router.get("/searchSlangword", searchSlangword);

export default router;
