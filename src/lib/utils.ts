import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Class Name Utility ───────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Input Sanitization ───────────────────────────────────────────────────────

export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags and content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")   // Remove style tags and content
    .replace(/<[^>]*>?/gm, "") // Strip remaining HTML tags
    .replace(/javascript:/gi, "") // Strip JS protocol
    .trim()
    .slice(0, 2000); // Hard cap length
}

// ─── Text Formatting ──────────────────────────────────────────────────────────

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

// ─── ID Generator ─────────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Eligibility Checker ──────────────────────────────────────────────────────

export interface EligibilityCheck {
  age: number;
  isCitizen: boolean;
  isResident: boolean;
  region?: string;
  residencyStatus: "citizen" | "permanent_resident" | "visa_holder" | "temporary_resident" | "other";
}

export interface EligibilityCheckResult {
  eligible: boolean;
  confidence: "high" | "medium" | "low";
  reasons: string[];
  nextSteps: string[];
}

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

export function safeLocalStorageGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

export function safeLocalStorageSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silently fail
  }
}

// ─── HTML Escape (XSS protection) ─────────────────────────────────────────

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
