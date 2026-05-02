import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Maximum character length for sanitized user input. */
const MAX_INPUT_LENGTH = 2000;

/** Milliseconds in one minute. */
const MS_PER_MINUTE = 60_000;

/** Milliseconds in one hour. */
const MS_PER_HOUR = 3_600_000;

/** Milliseconds in one day. */
const MS_PER_DAY = 86_400_000;

/** Number of days before falling back to absolute date formatting. */
const RELATIVE_TIME_MAX_DAYS = 7;

// ─── Class Name Utility ───────────────────────────────────────────────────────

/**
 * Merges Tailwind CSS class names with conflict resolution.
 * Combines `clsx` for conditional classes with `twMerge` for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Input Sanitization ───────────────────────────────────────────────────────

/**
 * Sanitizes user-provided text by stripping HTML/script tags, `javascript:` URIs,
 * trimming whitespace, and enforcing a hard character cap.
 *
 * @param input - The raw user input string.
 * @returns A sanitized, length-capped string safe for display and processing.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags and content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")   // Remove style tags and content
    .replace(/<[^>]*>?/gm, "") // Strip remaining HTML tags
    .replace(/javascript:/gi, "") // Strip JS protocol
    .trim()
    .slice(0, MAX_INPUT_LENGTH);
}

// ─── Text Formatting ──────────────────────────────────────────────────────────

/**
 * Truncates a string to `maxLength` characters, appending an ellipsis if trimmed.
 *
 * @param str - The string to truncate.
 * @param maxLength - Maximum allowed character length.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

/**
 * Capitalizes the first letter and lowercases the rest of the string.
 *
 * @param str - The string to capitalize.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

/**
 * Formats a Date or ISO string into a localized long-form date (e.g., "May 2, 2025").
 *
 * @param date - A `Date` object or ISO 8601 date string.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Returns a human-readable relative time string (e.g., "5m ago", "2d ago").
 * Falls back to `formatDate()` for dates older than {@link RELATIVE_TIME_MAX_DAYS} days.
 *
 * @param date - The date to format relative to now.
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / MS_PER_MINUTE);
  const diffHours = Math.floor(diffMs / MS_PER_HOUR);
  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < RELATIVE_TIME_MAX_DAYS) return `${diffDays}d ago`;
  return formatDate(date);
}

// ─── ID Generator ─────────────────────────────────────────────────────────────

/**
 * Generates a unique ID combining a timestamp and a random alphanumeric suffix.
 * Suitable for client-side IDs; not cryptographically secure.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Eligibility Checker ──────────────────────────────────────────────────────

/** Input parameters for the client-side eligibility check function. */
export interface EligibilityCheck {
  age: number;
  isCitizen: boolean;
  isResident: boolean;
  region?: string;
  residencyStatus: "citizen" | "permanent_resident" | "visa_holder" | "temporary_resident" | "other";
}

/** Result of the eligibility check including reasons and next steps. */
export interface EligibilityCheckResult {
  eligible: boolean;
  confidence: "high" | "medium" | "low";
  reasons: string[];
  nextSteps: string[];
}

/**
 * Performs a rule-based eligibility check against age, citizenship, and residency criteria.
 *
 * @param input - The eligibility check parameters.
 * @returns An object containing the eligibility verdict, confidence level, reasons, and next steps.
 */
export function checkEligibility(input: EligibilityCheck): EligibilityCheckResult {
  const reasons: string[] = [];
  const nextSteps: string[] = [];
  let eligible = true;
  let confidence: "high" | "medium" | "low" = "high";

  // Age check
  if (input.age < 18) {
    eligible = false;
    reasons.push("You must be at least 18 years old to vote in most regions.");
  } else {
    reasons.push(`✓ You meet the age requirement (${input.age} years old).`);
  }

  // Citizenship check
  if (!input.isCitizen) {
    if (input.residencyStatus === "permanent_resident") {
      eligible = false;
      confidence = "high";
      reasons.push("Permanent residents are typically not eligible to vote in national elections.");
      nextSteps.push("Check if you qualify for citizenship to gain voting rights.");
    } else {
      eligible = false;
      confidence = "high";
      reasons.push("Voter eligibility usually requires citizenship or specific legal status.");
      nextSteps.push("Contact your local election authority to understand your options.");
    }
  } else {
    reasons.push("✓ You are a citizen.");
  }

  // Residency check
  if (!input.isResident) {
    confidence = "medium";
    reasons.push("You must be a registered resident in your voting area.");
    nextSteps.push("Ensure you are registered at your current residence.");
  } else {
    reasons.push("✓ You meet the residency requirement.");
  }

  if (eligible) {
    nextSteps.push("Complete your voter registration before the deadline.");
    nextSteps.push("Gather required documents (ID, proof of address).");
    nextSteps.push("Find your polling station on our Locator page.");
  }

  return { eligible, confidence, reasons, nextSteps };
}

// ─── Debounce ─────────────────────────────────────────────────────────────────

/**
 * Creates a debounced version of the given function that delays invocation
 * until `delay` milliseconds have elapsed since the last call.
 *
 * @param fn - The function to debounce.
 * @param delay - Debounce delay in milliseconds.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ─── Local Storage (safe) ─────────────────────────────────────────────────────

/**
 * Safely reads and parses a value from `localStorage`, returning the `fallback`
 * if the key is missing or the stored value cannot be parsed.
 *
 * @param key - The localStorage key.
 * @param fallback - Default value when retrieval fails.
 */
export function safeLocalStorageGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safely serializes and stores a value in `localStorage`.
 * Silently fails if storage is unavailable (e.g., SSR, quota exceeded).
 *
 * @param key - The localStorage key.
 * @param value - The value to serialize and store.
 */
export function safeLocalStorageSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail — storage may be unavailable during SSR or quota exceeded
  }
}

// ─── HTML Escape (XSS protection) ─────────────────────────────────────────

/**
 * Escapes HTML special characters to prevent XSS when inserting text into the DOM.
 *
 * @param str - The raw string to escape.
 * @returns An HTML-safe string with `&`, `<`, `>`, `"`, and `'` replaced by entities.
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
}

// ─── Response Formatter ───────────────────────────────────────────────────────

/**
 * Converts AI-generated plain text into safe HTML with basic markdown formatting.
 * Escapes HTML entities first, then applies bold, italic, paragraph, and line-break transformations.
 *
 * @param text - Raw text from the AI model.
 * @returns Formatted HTML string safe for rendering via `dangerouslySetInnerHTML`.
 */
export function formatAIResponse(text: string): string {
  // Escape HTML entities first to prevent XSS
  const escaped = escapeHtml(text);
  // Then apply markdown formatting
  return escaped
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");
}
