import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { type NextRequest, NextResponse } from "next/server";

import { GAME_PROMPTS } from "@/lib/prompts";
import { GAME_CONFIG } from "@/lib/consts";
import { GeneratedStoryRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { userMessage, conversationHistory, isStart }: GeneratedStoryRequest =
      await request.json();

    let prompt: string = GAME_PROMPTS.INITIAL_STORY;

    if (!isStart) {
      const historyText = conversationHistory
        .map((message) => `${message.role}: ${message.content}`)
        .join("\n");

      prompt = GAME_PROMPTS.CONTINUE_STORY(historyText, userMessage);
    }

    const { text } = await generateText({
      model: google("gemini-2.5-flash"), // 👈 La Api key debe estar en .env ai.dev
      prompt,
    });

    const [narrative, imagePrompt] = text.split(GAME_CONFIG.IMAGE.SEPARATOR)

    return NextResponse.json({narrative, imagePrompt});

    
  } catch (error) {
    console.error("Error generating story", error);
    return NextResponse.json(
      { error: "Error al generar la historia" },
      { status: 500 }
    );
  }
}
