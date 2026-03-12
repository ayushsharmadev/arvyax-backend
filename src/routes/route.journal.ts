import { Router } from "express";
import { createJournal, getAllJournal } from "../controllers/controller.journal";

const router = Router();

router.get('/:userId', getAllJournal)
router.post("/", createJournal);

export default router;
