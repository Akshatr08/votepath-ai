import { describe, it, expect } from "vitest";
import {
  EligibilitySchema,
  ChatMessageSchema,
  TranslateSchema,
  FAQSearchSchema,
  OnboardingSchema,
} from "@/lib/validators";

// ─── EligibilitySchema ───────────────────────────────────────────────────────

describe("EligibilitySchema", () => {
  it("should accept valid input", () => {
    const result = EligibilitySchema.safeParse({
      age: 25,
      isCitizen: true,
      isResident: true,
      region: "Maharashtra",
      residencyStatus: "citizen",
    });
    expect(result.success).toBe(true);
  });

  it("should reject negative age", () => {
    const result = EligibilitySchema.safeParse({
      age: -1,
      isCitizen: true,
      isResident: true,
      region: "Test",
      residencyStatus: "citizen",
    });
    expect(result.success).toBe(false);
  });

  it("should reject age above 150", () => {
    const result = EligibilitySchema.safeParse({
      age: 200,
      isCitizen: true,
      isResident: true,
      region: "Test",
      residencyStatus: "citizen",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid residencyStatus", () => {
    const result = EligibilitySchema.safeParse({
      age: 25,
      isCitizen: true,
      isResident: true,
      region: "Test",
      residencyStatus: "invalid_status",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty region", () => {
    const result = EligibilitySchema.safeParse({
      age: 25,
      isCitizen: true,
      isResident: true,
      region: "",
      residencyStatus: "citizen",
    });
    expect(result.success).toBe(false);
  });

  it("should accept all valid residencyStatus values", () => {
    const statuses = ["citizen", "permanent_resident", "visa_holder", "temporary_resident", "other"];
    statuses.forEach((status) => {
      const result = EligibilitySchema.safeParse({
        age: 20,
        isCitizen: true,
        isResident: true,
        region: "Test",
        residencyStatus: status,
      });
      expect(result.success).toBe(true);
    });
  });

  it("should reject non-integer age", () => {
    const result = EligibilitySchema.safeParse({
      age: 18.5,
      isCitizen: true,
      isResident: true,
      region: "Test",
      residencyStatus: "citizen",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing fields", () => {
    expect(EligibilitySchema.safeParse({}).success).toBe(false);
    expect(EligibilitySchema.safeParse({ age: 20 }).success).toBe(false);
  });
});

// ─── ChatMessageSchema ───────────────────────────────────────────────────────

describe("ChatMessageSchema", () => {
  it("should accept valid message", () => {
    const result = ChatMessageSchema.safeParse({
      message: "How do I register to vote?",
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty message", () => {
    const result = ChatMessageSchema.safeParse({ message: "" });
    expect(result.success).toBe(false);
  });

  it("should reject message over 2000 chars", () => {
    const result = ChatMessageSchema.safeParse({ message: "a".repeat(2001) });
    expect(result.success).toBe(false);
  });

  it("should accept message with history", () => {
    const result = ChatMessageSchema.safeParse({
      message: "Hello",
      history: [
        { role: "user", parts: [{ text: "Hi" }] },
        { role: "model", parts: [{ text: "Hello!" }] },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid history role", () => {
    const result = ChatMessageSchema.safeParse({
      message: "Hello",
      history: [{ role: "admin", parts: [{ text: "Hi" }] }],
    });
    expect(result.success).toBe(false);
  });

  it("should default history to empty array", () => {
    const result = ChatMessageSchema.safeParse({ message: "Hello" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.history).toEqual([]);
    }
  });

  it("should accept optional language", () => {
    const result = ChatMessageSchema.safeParse({
      message: "Hello",
      language: "hi",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid language", () => {
    const result = ChatMessageSchema.safeParse({
      message: "Hello",
      language: "fr",
    });
    expect(result.success).toBe(false);
  });
});

// ─── TranslateSchema ─────────────────────────────────────────────────────────

describe("TranslateSchema", () => {
  it("should accept valid input", () => {
    const result = TranslateSchema.safeParse({
      text: "Hello",
      targetLanguage: "hi",
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty text", () => {
    const result = TranslateSchema.safeParse({
      text: "",
      targetLanguage: "hi",
    });
    expect(result.success).toBe(false);
  });

  it("should reject text over 5000 chars", () => {
    const result = TranslateSchema.safeParse({
      text: "a".repeat(5001),
      targetLanguage: "hi",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing targetLanguage", () => {
    const result = TranslateSchema.safeParse({ text: "Hello" });
    expect(result.success).toBe(false);
  });

  it("should reject too short targetLanguage", () => {
    const result = TranslateSchema.safeParse({
      text: "Hello",
      targetLanguage: "h",
    });
    expect(result.success).toBe(false);
  });
});

// ─── FAQSearchSchema ──────────────────────────────────────────────────────────

describe("FAQSearchSchema", () => {
  it("should accept valid query", () => {
    const result = FAQSearchSchema.safeParse({ query: "How to vote?" });
    expect(result.success).toBe(true);
  });

  it("should reject empty query", () => {
    const result = FAQSearchSchema.safeParse({ query: "" });
    expect(result.success).toBe(false);
  });

  it("should reject query over 500 chars", () => {
    const result = FAQSearchSchema.safeParse({ query: "a".repeat(501) });
    expect(result.success).toBe(false);
  });

  it("should reject missing query", () => {
    const result = FAQSearchSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ─── OnboardingSchema ─────────────────────────────────────────────────────────

describe("OnboardingSchema", () => {
  it("should accept valid onboarding data", () => {
    const result = OnboardingSchema.safeParse({
      country: "IN",
      state: "Goa",
      age: "24", // testing coercion
      isFirstTimeVoter: "true", // testing coercion
      votingMethod: "online",
      preferredLanguage: "en",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid age", () => {
    const result = OnboardingSchema.safeParse({
      country: "IN",
      state: "Goa",
      age: 0,
      isFirstTimeVoter: true,
      votingMethod: "online",
      preferredLanguage: "en",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid votingMethod", () => {
    const result = OnboardingSchema.safeParse({
      country: "IN",
      state: "Goa",
      age: 20,
      isFirstTimeVoter: true,
      votingMethod: "mail-in", // invalid enum
      preferredLanguage: "en",
    });
    expect(result.success).toBe(false);
  });
});
