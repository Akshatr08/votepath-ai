import { type NextRequest } from "next/server";
import { translateText } from "@/lib/google-cloud";

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json();
    if (!text || !targetLanguage) {
      return Response.json({ success: false, error: "Text and targetLanguage are required" }, { status: 400 });
    }

    const translatedText = await translateText(text, targetLanguage);
    return Response.json({ success: true, data: translatedText });
  } catch (error) {
    console.error("[/api/translate] Error:", error);
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
