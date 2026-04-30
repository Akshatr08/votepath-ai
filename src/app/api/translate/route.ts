import { type NextRequest } from "next/server";
import { translateText } from "@/lib/google-cloud";
import { checkRateLimit } from "@/lib/rate-limiter";
import { TranslateSchema } from "@/lib/validators";
import { sanitizeInput } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    // ─── Rate Limiting ───────────────────────────────────────────────────────
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
    const limit = checkRateLimit(`translate-${ip}`);
    if (!limit.allowed) {
      return Response.json({ success: false, error: "Too many requests." }, { status: 429 });
    }

    // ─── Input Validation ────────────────────────────────────────────────────
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return Response.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = TranslateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return Response.json({ success: false, error: "Invalid input." }, { status: 400 });
    }

    const { text, targetLanguage } = parsed.data;
    const sanitizedText = sanitizeInput(text);

    // ─── Logic ───────────────────────────────────────────────────────────────
    const translatedText = await translateText(sanitizedText, targetLanguage);
    
    return Response.json({ success: true, data: translatedText });
  } catch (error) {
    console.error("[/api/translate] Error:", error);
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
