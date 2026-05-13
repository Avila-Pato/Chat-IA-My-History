import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { type NextRequest, NextResponse } from "next/server";

import { GAME_PROMPTS } from "@/lib/prompts";
import { GeneratedImageRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { imagePrompt }: GeneratedImageRequest = await request.json();

    const prompt = GAME_PROMPTS.GENERATE_IMAGE(imagePrompt);

    const { files } = await generateText({
      model: google("gemini-2.5-flash-image"), // La Api key debe estar en .env de pago en cuenta para generar imagenes
      prompt,
      providerOptions: {
        google: {
          responseModalities: ["IMAGE"],
        },
      },
    });

    return NextResponse.json({ image: files[0]?.base64 ?? null });
  } catch (error) {
    console.error("Error generating image", error);
    return NextResponse.json(
      { error: "Error al generar la imagen" },
      { status: 500 }
    );
  }
}
