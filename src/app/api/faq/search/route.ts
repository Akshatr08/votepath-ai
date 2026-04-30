import { type NextRequest } from "next/server";
import { getEmbeddings } from "@/lib/google-cloud";
import { FAQ_DATA } from "@/constants";
import { sanitizeInput } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rate-limiter";
import { FAQSearchSchema } from "@/lib/validators";

function cosineSimilarity(a: number[], b: number[]) {
  if (a.length !== b.length) return 0;
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function POST(request: NextRequest) {
  try {
    // ─── Rate Limiting ───────────────────────────────────────────────────────
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
    const limit = checkRateLimit(`faq-${ip}`);
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

    const parsed = FAQSearchSchema.safeParse(rawBody);
    if (!parsed.success) {
      return Response.json({ success: false, error: "Invalid query." }, { status: 400 });
    }

    const sanitizedQuery = sanitizeInput(parsed.data.query);
    const queryEmbedding = await getEmbeddings(sanitizedQuery);

    if (queryEmbedding.length === 0) {
      return Response.json({ success: false, error: "AI service unavailable." }, { status: 503 });
    }

    // ─── Semantic Search ─────────────────────────────────────────────────────
    // Note: In production, embeddings would be pre-cached.
    const results = await Promise.all(
      FAQ_DATA.map(async (faq) => {
        const faqEmbedding = await getEmbeddings(faq.question);
        const similarity = cosineSimilarity(queryEmbedding, faqEmbedding);
        return { ...faq, similarity };
      })
    );

    const sortedResults = results
      .filter((r) => r.similarity > 0.7)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    return Response.json({ success: true, data: sortedResults });
  } catch (error) {
    console.error("[/api/faq/search] Error:", error);
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
