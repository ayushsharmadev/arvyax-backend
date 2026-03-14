import { Router } from "express";
import {
  anaylyzeJournal,
  createJournal,
  getAllJournal,
  userInsights,
} from "../controllers/controller.journal";

const router = Router();

router.get("/:userId", getAllJournal);
router.post("/", createJournal);
router.post("/anaylze/:journalId", anaylyzeJournal);
router.get("/insights/:userId", userInsights)

export default router;
