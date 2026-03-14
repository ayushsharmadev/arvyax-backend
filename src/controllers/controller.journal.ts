import { Request, Response } from "express";
import { db } from "../lib/db.js";
import { analysisAgent } from "../lib/agent.js";

interface CreateJournalInput {
  userId: string;
  ambience: "forest" | "ocean" | "mountain";
  text: string;
}

export const createJournal = async (req: Request, res: Response) => {
  try {
    const { userId, ambience, text }: CreateJournalInput = req.body;

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
    res.status(500).json({ message: "Something went wrong" });
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
    const response = await analysisAgent(text);
    try {
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
    } catch (error) {
      console.log("❌ Error in analysis result upsertion");
    }
    res.json(response);
  } catch (error) {
    console.log("❌ Error in analyzeJournal controller");
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const userInsights = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const { userId } = req.params;

    /// Application Level get insights logic for smaller dataset
    // const journals = await db.journal.findMany({
    //   where: { userId: userId },
    //   include: { analyses: true },
    //   orderBy: { createdAt: "desc" },
    // });

    // const totalEntries = journals.length;
    // const emotionCount: Record<string, number> = {};
    // const ambienceCount: Record<string, number> = {};
    // const keywords: string[] = [];

    // journals.forEach((j) => {
    //   ambienceCount[j.ambience] = (ambienceCount[j.ambience] || 0) + 1;

    //   j.analyses.forEach((a) => {
    //     emotionCount[a.emotion] = (emotionCount[a.emotion] || 0) + 1;
    //     keywords.push(...a.keywords);
    //   });
    // });

    // const topEmotion = Object.keys(emotionCount).reduce(
    //   (a, b) => (emotionCount[a] > emotionCount[b] ? a : b),
    //   Object.keys(emotionCount)[0],
    // );

    // const mostUsedAmbience = Object.keys(ambienceCount).reduce(
    //   (a, b) => (ambienceCount[a] > ambienceCount[b] ? a : b),
    //   Object.keys(ambienceCount)[0],
    // );
    // const recentKeywords = [...new Set(keywords)].slice(0, 3);

    // res.json({
    //   totalEntries,
    //   topEmotion,
    //   mostUsedAmbience,
    //   recentKeywords,
    // });

    /// DB Aggregation query for large scale system
        const totalEntries = await db.journal.count({
      where: { userId },
    });

    // most used ambience
    const ambience = await db.journal.groupBy({
      by: ["ambience"],
      where: { userId },
      _count: { ambience: true },
      orderBy: { _count: { ambience: "desc" } },
      take: 1,
    });

    // top emotion
    const emotion = await db.analysis.groupBy({
      by: ["emotion"],
      where: {
        journal: { userId },
      },
      _count: { emotion: true },
      orderBy: { _count: { emotion: "desc" } },
      take: 1,
    });

    // recent keywords
    const recentAnalysis = await db.analysis.findMany({
      where: {
        journal: { userId },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { keywords: true },
    });

    const recentKeywords = [
      ...new Set(recentAnalysis.flatMap((a) => a.keywords)),
    ].slice(0, 3);

    res.json({
      totalEntries,
      topEmotion: emotion[0]?.emotion || null,
      mostUsedAmbience: ambience[0]?.ambience || null,
      recentKeywords,
    });
  } catch (error) {
    console.log("❌ Error in userInsights controller");
    res.status(500).json({ message: "Something went wrong" });
  }
};
