import { type NextRequest } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import { sanitizeInput } from "@/lib/utils";
import { analyzeSentiment, analyzeEntities } from "@/lib/google-cloud";
import { logQueryInsight } from "@/lib/firestore";
import { checkRateLimit } from "@/lib/rate-limiter";
import { ChatMessageSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    // ─── Rate Limiting ───────────────────────────────────────────────────────
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
    const limit = checkRateLimit(`chat-${ip}`);
    
    if (!limit.allowed) {
      return Response.json(
        { success: false, error: "Too many requests. Please wait a moment." },
        { 
          status: 429,
          headers: {
            "Retry-After": Math.ceil((limit.resetAt - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    // ─── Input Validation ────────────────────────────────────────────────────
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return Response.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = ChatMessageSchema.safeParse(rawBody);
    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Invalid input.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message, history: rawHistory, userId } = parsed.data;
    const sanitizedMessage = sanitizeInput(message);
    
    // Hard check after sanitization
    if (sanitizedMessage.length === 0) {
      return Response.json({ success: false, error: "Message cannot be empty." }, { status: 400 });
    }

    // Process history
    const history = rawHistory.slice(-10).map((msg) => ({
      role: msg.role,
      parts: msg.parts.map((p) => ({ text: sanitizeInput(p.text).slice(0, 500) })),
    }));

    // ─── Parallel Analytics & AI Prep ────────────────────────────────────────
    const [sentiment, entities] = await Promise.all([
      analyzeSentiment(sanitizedMessage),
      analyzeEntities(sanitizedMessage),
    ]);

    // Log insights (fire and forget)
    logQueryInsight({
      userId,
      query: sanitizedMessage,
      sentiment: sentiment?.score || 0,
      entities: entities.slice(0, 5).map((e) => e.name || ""),
      timestamp: new Date(),
    }).catch(console.error);

    // ─── Gemini AI Call ──────────────────────────────────────────────────────
    const model = getGeminiModel();
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(sanitizedMessage);
    const text = result.response.text();

    if (!text) {
      return Response.json(
        { success: false, error: "No response from AI. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ success: true, data: { text } });
  } catch (err) {
    console.error("[/api/chat] Error:", err);
    return Response.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "POST, OPTIONS" },
  });
}
