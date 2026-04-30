import { describe, it, expect } from "vitest";
import { getGeminiModel, SYSTEM_PROMPT } from "@/lib/gemini";

// The GoogleGenerativeAI mock is defined in setup.ts as a proper constructor

describe("Gemini Configuration", () => {
  it("should have a non-empty system prompt", () => {
    expect(SYSTEM_PROMPT.length).toBeGreaterThan(100);
  });

  it("system prompt should enforce neutrality", () => {
    expect(SYSTEM_PROMPT.toLowerCase()).toContain("neutral");
    expect(SYSTEM_PROMPT.toLowerCase()).toContain("non-partisan");
  });

  it("system prompt should reference official sources", () => {
    expect(SYSTEM_PROMPT).toContain("eci.gov.in");
    expect(SYSTEM_PROMPT).toContain("vote.gov");
  });

  it("should throw if GEMINI_API_KEY is not set", () => {
    const original = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    expect(() => getGeminiModel()).toThrow("GEMINI_API_KEY is not configured");
    if (original) process.env.GEMINI_API_KEY = original;
  });

  it("should return a model when API key is set", () => {
    process.env.GEMINI_API_KEY = "test-key-123";
    const model = getGeminiModel();
    expect(model).toBeDefined();
    expect(model.startChat).toBeDefined();
    delete process.env.GEMINI_API_KEY;
  });
});
