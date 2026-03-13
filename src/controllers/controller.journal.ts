import { Request, Response } from "express";
import { db } from "../lib/db";
import { analysisAgent } from "../lib/agent";

export const createJournal = async (req: Request, res: Response) => {
  try {
    const { userId, ambience, text } = req.body;

    if (!userId || !ambience || !text) {
      return res.status(401).json({ message: "All Fields are required!" });
    }

    const user = await db.journal.create({
      data: {
        userId,
        ambience,
        text,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("❌ Error in createJournal controller");
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const getAllJournal = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId parameter required" });
    }
    const users = await db.journal.findMany({ where: { userId: userId } });
    res.json(users);
  } catch (error) {
    console.log("❌ Error in getAllJournal controller");
    res.status(401).json({ message: "Something went wrong" });
  }
};

export const anaylyzeJournal = async (
  req: Request<{ journalId: string }>,
  res: Response,
) => {
  try {
    const { journalId } = req.params;
    const { text } = req.body;
    if (!journalId) {
      return res.status(400).json({ message: "journalId parameter required!" });
    }
    if (!text) {
      return res.status(400).json({ message: "text required!" });
    }
    const response = await analysisAgent({ journalId, text });

    await db.analysis.upsert({
      where: { journalId: journalId },
      update: {
        emotion: response.emotion,
        keywords: response.keywords,
        summary: response.summary,
      },
      create: {
        journalId: journalId,
        emotion: response.emotion,
        keywords: response.keywords,
        summary: response.summary,
      },
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log("❌ Error in analyzeJournal controller");
  }
};
