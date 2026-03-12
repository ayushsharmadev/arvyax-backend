import { Request, Response } from "express";
import { db } from "../lib/db";

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
    console.log(userId);
    const users = await db.journal.findMany({ where: { userId: userId } });
    res.json(users);
  } catch (error) {
    console.log("❌ Error in getAllJournal controller");
    res.status(401).json({ message: "Something went wrong" });
  }
};
