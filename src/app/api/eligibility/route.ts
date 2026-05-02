import { type NextRequest } from "next/server";
import { checkEligibility } from "@/lib/utils";
import { EligibilitySchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
  try {
    // ─── Rate Limiting ───────────────────────────────────────────────────────
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
    const limit = checkRateLimit(`eligibility-${ip}`, 20); // More generous for static logic
    
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

    const parsed = EligibilitySchema.safeParse(rawBody);
    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Invalid input.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // ─── Logic ───────────────────────────────────────────────────────────────
    const result = checkEligibility(parsed.data);

    return Response.json(
      {
        success: true,
        data: {
          ...result,
          disclaimer:
            "⚠️ This is a general eligibility assessment only. Voting rules vary by region and can change. Please verify all requirements with your official local election authority before taking any action.",
        },
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(limit.remaining),
          "X-RateLimit-Reset": String(Math.ceil(limit.resetAt / 1000)),
        },
      }
    );
  } catch (err) {
    console.error("[/api/eligibility] Error:", err);
    return Response.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
