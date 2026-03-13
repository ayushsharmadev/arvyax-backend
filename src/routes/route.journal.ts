import { Router } from "express";
import {
  anaylyzeJournal,
  createJournal,
  getAllJournal,
} from "../controllers/controller.journal";

const router = Router();

router.get("/:userId", getAllJournal);
router.post("/", createJournal);
router.post("/anaylze/:journalId", anaylyzeJournal);

export default router;
