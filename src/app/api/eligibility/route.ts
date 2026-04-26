import { type NextRequest } from "next/server";
import { checkEligibility } from "@/lib/utils";
import { z } from "zod";

const EligibilitySchema = z.object({
  age: z.number().int().min(0).max(150),
  isCitizen: z.boolean(),
  isResident: z.boolean(),
  region: z.string().min(1).max(100),
  residencyStatus: z.enum(["citizen", "permanent_resident", "temporary_resident", "other"]),
});

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    const parsed = EligibilitySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Invalid input.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = checkEligibility(parsed.data);

    return Response.json({
      success: true,
      data: {
        ...result,
        disclaimer:
          "⚠️ This is a general eligibility assessment only. Voting rules vary by region and can change. Please verify all requirements with your official local election authority before taking any action.",
      },
    });
  } catch (err) {
    console.error("[/api/eligibility] Error:", err);
    return Response.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
