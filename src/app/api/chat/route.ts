import { type NextRequest } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import { sanitizeInput } from "@/lib/utils";
import { RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW_MS } from "@/constants";
import { analyzeSentiment, analyzeEntities } from "@/lib/google-cloud";
import { logQueryInsight } from "@/lib/firestore";
import type { ChatApiRequest } from "@/types";

// ─── Simple in-memory rate limiter ─────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_REQUESTS) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const key = getRateLimitKey(request);
    if (!checkRateLimit(key)) {
      return Response.json(
        { success: false, error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    // Parse & validate body
    let body: ChatApiRequest;
    try {
      body = await request.json();
    } catch {
      return Response.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    if (!body.message || typeof body.message !== "string") {
      return Response.json({ success: false, error: "Message is required." }, { status: 400 });
    }

    const sanitizedMessage = sanitizeInput(body.message);
    if (sanitizedMessage.length === 0) {
      return Response.json({ success: false, error: "Message cannot be empty." }, { status: 400 });
    }
    if (sanitizedMessage.length > 1000) {
      return Response.json({ success: false, error: "Message is too long." }, { status: 400 });
    }

    // Build history for multi-turn chat
    const history = (body.history ?? []).slice(-10).map((msg) => ({
      role: msg.role as "user" | "model",
      parts: msg.parts.map((p) => ({ text: sanitizeInput(p.text).slice(0, 500) })),
    }));

    // ─── Parallel Analytics & AI Prep ────────────────────────────────────────
    const [sentiment, entities] = await Promise.all([
      analyzeSentiment(sanitizedMessage),
      analyzeEntities(sanitizedMessage),
    ]);

    // Log insights (fire and forget)
    logQueryInsight({
      userId: body.userId,
      query: sanitizedMessage,
      sentiment: sentiment?.score || 0,
      entities: entities.slice(0, 5).map((e) => e.name || ""),
      timestamp: new Date(),
    }).catch(console.error);

    // Call Gemini
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
