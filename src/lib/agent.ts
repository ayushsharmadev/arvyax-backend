type analysisAgentInput = {
  journalId: string;
  text: string;
};

type analysisAgentResponse = {
  emotion: string;
  keywords: string[];
  summary: string;
};

import { GoogleGenAI } from "@google/genai";
import { sys_prompt } from "../constant";

const ai = new GoogleGenAI({});

export const analysisAgent = async ({
  journalId,
  text,
}: analysisAgentInput): Promise<analysisAgentResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "system",
          parts: [{ text: sys_prompt }],
        },
        {
          role: "user",
          parts: [{ text: text }],
        },
      ],
    });
    console.log("LLM Response ", response.text);
    const parsedAnaylysis = JSON.parse(response.text || "{}");
    return {
      emotion: parsedAnaylysis.emotion,
      keywords: parsedAnaylysis.keywords,
      summary: parsedAnaylysis.summary,
    };
  } catch (error) {
    return {
      emotion: "neutral",
      keywords: ["neurtral", "calm", "hot"],
      summary: "overall summary is good",
    };
  }
};
