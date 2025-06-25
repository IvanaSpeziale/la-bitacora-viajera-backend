import { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getTrendingActivities = async (req: Request, res: Response) => {
  const { destination } = req.body;

  if (!destination) {
    return res.status(400).json({ error: "Destination is required" });
  }

  try {
    const prompt = `What are the trending activities in ${destination}?`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = completion.choices[0].message?.content || "";
    return res.json({ activities: responseText });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return res
      .status(500)
      .json({ error: "Error fetching activities from OpenAI" });
  }
};
