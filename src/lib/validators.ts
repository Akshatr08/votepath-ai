import { z } from "zod";

// ─── Shared Validation Schemas ────────────────────────────────────────────────

export const EligibilitySchema = z.object({
  age: z.number().int().min(0).max(150),
  isCitizen: z.boolean(),
  isResident: z.boolean(),
  region: z.string().min(1).max(100),
  residencyStatus: z.enum([
    "citizen",
    "permanent_resident",
    "visa_holder",
    "temporary_resident",
    "other",
  ]),
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1, "Message is required").max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        parts: z.array(z.object({ text: z.string() })),
      })
    )
    .optional()
    .default([]),
  language: z.enum(["en", "hi"]).optional(),
  userId: z.string().optional(),
});

export const TranslateSchema = z.object({
  text: z.string().min(1, "Text is required").max(5000),
  targetLanguage: z
    .string()
    .min(2, "Target language is required")
    .max(10, "Invalid language code"),
});

export const FAQSearchSchema = z.object({
  query: z.string().min(1, "Query is required").max(500),
});

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type EligibilityInput = z.infer<typeof EligibilitySchema>;
export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;
export type TranslateInput = z.infer<typeof TranslateSchema>;
export type FAQSearchInput = z.infer<typeof FAQSearchSchema>;
