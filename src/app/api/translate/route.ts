import { type NextRequest } from "next/server";
import { translateText } from "@/lib/google-cloud";
import { checkRateLimit } from "@/lib/rate-limiter";
import { TranslateSchema } from "@/lib/validators";
import { sanitizeInput } from "@/lib/utils";
import { withCors } from "@/lib/security";

/**
 * Translates text using Google Cloud Translation API.
 * Sanitizes input before translation and enforces per-IP rate limiting.
 * @param request - Next.js incoming request with text and target language code.
 * @returns JSON with the translated text string.
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // ─── Rate Limiting ───────────────────────────────────────────────────────
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
    const limit = checkRateLimit(`translate-${ip}`);
    if (!limit.allowed) {
      return Response.json(
        { success: false, error: "Too many requests." },
        { status: 429, headers: withCors() }
      );
    }

    // ─── Input Validation ────────────────────────────────────────────────────
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400, headers: withCors() }
      );
    }

    const parsed = TranslateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Invalid input." },
        { status: 400, headers: withCors() }
      );
    }

    const { text, targetLanguage } = parsed.data;
    const sanitizedText = sanitizeInput(text);

    // ─── Logic ───────────────────────────────────────────────────────────────
    const translatedText = await translateText(sanitizedText, targetLanguage);
    
    return Response.json(
      { success: true, data: translatedText },
      {
        headers: withCors({
          "X-RateLimit-Remaining": String(limit.remaining),
          "X-RateLimit-Reset": String(Math.ceil(limit.resetAt / 1000)),
        }),
      }
    );
  } catch (error) {
    console.error("[/api/translate] Error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: withCors() }
    );
  }
}

/**
 * Handles CORS preflight requests.
 * @returns 204 No Content with allowed methods.
 */
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: withCors({ Allow: "POST, OPTIONS" }),
  });
}
