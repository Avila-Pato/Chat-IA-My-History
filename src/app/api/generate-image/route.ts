import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { type NextRequest, NextResponse } from "next/server";

import { GAME_PROMPTS } from "@/lib/prompts";
import { GAME_CONFIG } from "@/lib/consts";
import { GeneratedImageRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { imagePrompt }: GeneratedImageRequest =
      await request.json();

    const  prompt  = GAME_PROMPTS.GENERATE_IMAGE(imagePrompt);

    const { files } = await generateText({
      model: google("gemini-2.5-flash-image-preview"), // 👈 La Api key debe estar en .env ai.dev
      prompt,
      providerOptions: {
        google: {
            responseModalities: ['IMAGE']
        }
      }
    });
    // console.log("Generated Files: " ,files)

    return NextResponse.json({ image: files[0] || null });

    
  } catch (error) {
    console.error("Error generating story", error);
    return NextResponse.json(
      { error: "Error al generar la historia" },
      { status: 500 }
    );
  }
}
