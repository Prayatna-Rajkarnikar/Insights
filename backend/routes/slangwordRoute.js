import { Router } from "express";
import { addWord } from "../controllers/slangwordController.js";

const router = Router();

router.post("/addSlangword", addWord);

export default router;
