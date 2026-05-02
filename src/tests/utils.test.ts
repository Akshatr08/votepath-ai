import { describe, it, expect } from "vitest";
import { checkEligibility, sanitizeInput } from "@/lib/utils";

describe("Eligibility Logic", () => {
  it("should return eligible for a 18+ citizen resident", () => {
    const result = checkEligibility({
      age: 20,
      isCitizen: true,
      isResident: true,
      region: "Maharashtra",
      residencyStatus: "citizen"
    });
    expect(result.eligible).toBe(true);
    expect(result.confidence).toBe("high");
  });

  // ─── Parametric Tests for High Coverage ───────────────────────────────────
  const regions = ["Maharashtra", "California", "London", "Ontario", "New South Wales", "Delhi", "Texas", "Berlin"];
  const ages = [17, 18, 21, 65];
  const statuses = ["citizen", "permanent_resident", "visa_holder"];

  regions.forEach(region => {
    ages.forEach(age => {
      statuses.forEach(status => {
        it(`should correctly determine eligibility for ${region}, age ${age}, status ${status}`, () => {
          const result = checkEligibility({
            age,
            isCitizen: status === "citizen",
            isResident: true,
            region,
            residencyStatus: status as "citizen" | "permanent_resident" | "visa_holder" | "temporary_resident" | "other"
          });
          
          if (age < 18) {
            expect(result.eligible).toBe(false);
          } else if (status !== "citizen") {
            expect(result.eligible).toBe(false);
          } else {
            expect(result.eligible).toBe(true);
          }
        });
      });
    });
  });

  it("should return ineligible for non-residents", () => {
    const result = checkEligibility({
      age: 25,
      isCitizen: true,
      isResident: false,
      region: "Maharashtra",
      residencyStatus: "citizen"
    });
    expect(result.eligible).toBe(false);
    expect(result.confidence).toBe("medium");
  });
});

describe("Sanitization Utility", () => {
  it("should strip HTML tags", () => {
    const input = "<script>alert('xss')</script>Hello <b>World</b>";
    const result = sanitizeInput(input);
    expect(result).toBe("Hello World");
  });

  it("should handle empty strings", () => {
    expect(sanitizeInput("")).toBe("");
    expect(sanitizeInput("   ")).toBe("");
  });
});
