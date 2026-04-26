import { type NextRequest } from "next/server";
import { getEmbeddings } from "@/lib/google-cloud";
import { FAQ_DATA } from "@/constants";
import { sanitizeInput } from "@/lib/utils";

function cosineSimilarity(a: number[], b: number[]) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query || typeof query !== "string") {
      return Response.json({ success: false, error: "Query is required" }, { status: 400 });
    }

    const sanitizedQuery = sanitizeInput(query);
    const queryEmbedding = await getEmbeddings(sanitizedQuery);

    if (queryEmbedding.length === 0) {
      return Response.json({ success: false, error: "Failed to generate embeddings" }, { status: 500 });
    }

    // In a real app, FAQ embeddings would be pre-calculated and stored.
    // For this 100% Google Services demo, we calculate them on the fly or use mock logic if API is unavailable.
    const results = await Promise.all(
      FAQ_DATA.map(async (faq) => {
        const faqEmbedding = await getEmbeddings(faq.question);
        const similarity = cosineSimilarity(queryEmbedding, faqEmbedding);
        return { ...faq, similarity };
      })
    );

    const sortedResults = results
      .filter((r) => r.similarity > 0.7) // Threshold for "semantic match"
      .sort((a, b) => b.similarity - a.similarity);

    return Response.json({ success: true, data: sortedResults });
  } catch (error) {
    console.error("[/api/faq/search] Error:", error);
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
