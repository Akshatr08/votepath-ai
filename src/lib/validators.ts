import { z } from "zod";

// ─── Shared Validation Schemas ────────────────────────────────────────────────

/**
 * Zod schema for validating eligibility check API requests.
 * Enforces integer age (0–150), boolean flags, region string, and residency enum.
 */
export const EligibilitySchema = z.object({
  age: z.coerce.number().int().min(0).max(150),
  isCitizen: z.boolean(),
  isResident: z.boolean(),
  country: z.string().min(1).max(100).default("IN"),
  region: z.string().min(1).max(100),
  residencyStatus: z.enum([
    "citizen",
    "permanent_resident",
    "visa_holder",
    "temporary_resident",
    "other",
  ]),
});

/**
 * Zod schema for validating chat message API requests.
 * Enforces a non-empty message, optional conversation history, and language preference.
 */
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

/**
 * Zod schema for validating translation API requests.
 * Enforces non-empty text (up to 5000 chars) and a valid language code.
 */
export const TranslateSchema = z.object({
  text: z.string().min(1, "Text is required").max(5000),
  targetLanguage: z
    .string()
    .min(2, "Target language is required")
    .max(10, "Invalid language code"),
});

/**
 * Zod schema for validating FAQ semantic search requests.
 * Enforces a non-empty query string (up to 500 chars).
 */
export const FAQSearchSchema = z.object({
  query: z.string().min(1, "Query is required").max(500),
});

/**
 * Zod schema for validating user onboarding data.
 * Enforces country/state selection, integer age, and preferences.
 */
export const OnboardingSchema = z.object({
  country: z.string().min(1, "Please select a country"),
  state: z.string().min(1, "Please select a state/region"),
  age: z.coerce.number().int().min(1, "Please enter your age").max(120),
  isFirstTimeVoter: z.union([z.boolean(), z.string().transform((v) => v === "true")]),
  votingMethod: z.enum(["online", "offline", "both"]),
  preferredLanguage: z.enum(["en", "hi"]),
});

// ─── Type Exports ─────────────────────────────────────────────────────────────

/** Inferred TypeScript type from {@link EligibilitySchema}. */
export type EligibilityInput = z.infer<typeof EligibilitySchema>;

/** Inferred TypeScript type from {@link ChatMessageSchema}. */
export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;

/** Inferred TypeScript type from {@link TranslateSchema}. */
export type TranslateInput = z.infer<typeof TranslateSchema>;

/** Inferred TypeScript type from {@link FAQSearchSchema}. */
export type FAQSearchInput = z.infer<typeof FAQSearchSchema>;

/** Inferred TypeScript type from {@link OnboardingSchema}. */
export type OnboardingInput = z.infer<typeof OnboardingSchema>;
