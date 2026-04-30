import { describe, it, expect, beforeEach } from "vitest";
import {
  sanitizeInput,
  escapeHtml,
  formatAIResponse,
  truncate,
  capitalize,
  formatDate,
  formatRelativeTime,
  generateId,
  debounce,
  safeLocalStorageGet,
  safeLocalStorageSet,
  cn,
} from "@/lib/utils";

// ─── sanitizeInput ────────────────────────────────────────────────────────────

describe("sanitizeInput", () => {
  it("should strip <script> tags and their content", () => {
    expect(sanitizeInput("<script>alert('xss')</script>Hello")).toBe("Hello");
  });

  it("should strip nested script tags", () => {
    expect(sanitizeInput("<script>var x = '<not closed>';</script>Clean")).toBe("Clean");
  });

  it("should strip <style> tags and their content", () => {
    expect(sanitizeInput("<style>body{color:red}</style>Hello")).toBe("Hello");
  });

  it("should strip all remaining HTML tags", () => {
    expect(sanitizeInput("<b>Bold</b> <i>Italic</i>")).toBe("Bold Italic");
    expect(sanitizeInput('<img src="x" onerror="alert(1)">')).toBe("");
    expect(sanitizeInput('<a href="evil">Link</a>')).toBe("Link");
  });

  it("should strip javascript: protocol", () => {
    expect(sanitizeInput("javascript:alert(1)")).toBe("alert(1)");
  });

  it("should handle empty and whitespace-only strings", () => {
    expect(sanitizeInput("")).toBe("");
    expect(sanitizeInput("   ")).toBe("");
    expect(sanitizeInput("\t\n")).toBe("");
  });

  it("should trim the result", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });

  it("should hard cap at 2000 characters", () => {
    const longStr = "a".repeat(3000);
    expect(sanitizeInput(longStr).length).toBe(2000);
  });

  it("should handle XSS payloads", () => {
    const payloads = [
      '<svg onload="alert(1)">',
      '<img src=x onerror=alert(1)>',
      '<div style="background:url(javascript:alert(1))">',
      '"><script>alert(document.cookie)</script>',
      "';!--\"<XSS>=&{()}",
    ];
    payloads.forEach((payload) => {
      const result = sanitizeInput(payload);
      expect(result).not.toContain("<script");
      expect(result).not.toContain("<svg");
      expect(result).not.toContain("<img");
      expect(result).not.toContain("onerror");
      expect(result).not.toContain("onload");
    });
  });

  it("should preserve clean text", () => {
    expect(sanitizeInput("How do I register to vote?")).toBe("How do I register to vote?");
  });
});

// ─── escapeHtml ───────────────────────────────────────────────────────────────

describe("escapeHtml", () => {
  it("should escape & < > \" '", () => {
    expect(escapeHtml('&<>"')).toBe("&amp;&lt;&gt;&quot;");
    expect(escapeHtml("'")).toBe("&#x27;");
  });

  it("should not alter clean text", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });

  it("should escape HTML injection attempts", () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
    );
  });
});

// ─── formatAIResponse ─────────────────────────────────────────────────────────

describe("formatAIResponse", () => {
  it("should convert markdown bold to <strong>", () => {
    const result = formatAIResponse("**bold text**");
    expect(result).toContain("<strong>");
    expect(result).toContain("bold text");
  });

  it("should convert markdown italic to <em>", () => {
    const result = formatAIResponse("*italic text*");
    expect(result).toContain("<em>");
  });

  it("should convert double newlines to paragraph breaks", () => {
    const result = formatAIResponse("Para 1\n\nPara 2");
    expect(result).toContain("</p><p>");
  });

  it("should convert single newlines to <br/>", () => {
    const result = formatAIResponse("Line 1\nLine 2");
    expect(result).toContain("<br/>");
  });

  it("should escape HTML in AI responses to prevent XSS", () => {
    const result = formatAIResponse('<script>alert("hack")</script>');
    expect(result).not.toContain("<script>");
    expect(result).toContain("&lt;script&gt;");
  });
});

// ─── truncate ─────────────────────────────────────────────────────────────────

describe("truncate", () => {
  it("should return original string if within maxLength", () => {
    expect(truncate("short", 10)).toBe("short");
  });

  it("should truncate with ellipsis when exceeding maxLength", () => {
    expect(truncate("This is a long string", 10)).toBe("This is a …");
  });

  it("should handle empty string", () => {
    expect(truncate("", 5)).toBe("");
  });

  it("should handle exact length", () => {
    expect(truncate("exact", 5)).toBe("exact");
  });
});

// ─── capitalize ───────────────────────────────────────────────────────────────

describe("capitalize", () => {
  it("should capitalize first letter and lowercase rest", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("HELLO")).toBe("Hello");
    expect(capitalize("hELLO")).toBe("Hello");
  });

  it("should handle single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("should handle empty string", () => {
    expect(capitalize("")).toBe("");
  });
});

// ─── formatDate ───────────────────────────────────────────────────────────────

describe("formatDate", () => {
  it("should format a Date object", () => {
    const date = new Date("2025-05-12T00:00:00Z");
    const result = formatDate(date);
    expect(result).toContain("2025");
    expect(result).toContain("May");
  });

  it("should format a date string", () => {
    const result = formatDate("2025-01-15");
    expect(result).toContain("2025");
    expect(result).toContain("January");
  });
});

// ─── formatRelativeTime ──────────────────────────────────────────────────────

describe("formatRelativeTime", () => {
  it('should return "just now" for very recent dates', () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe("just now");
  });

  it("should return minutes for recent dates", () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(date)).toBe("5m ago");
  });

  it("should return hours for same-day dates", () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(formatRelativeTime(date)).toBe("3h ago");
  });

  it("should return days for recent past dates", () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(date)).toBe("2d ago");
  });

  it("should return formatted date for old dates", () => {
    const date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = formatRelativeTime(date);
    // Should fall back to formatDate
    expect(result).toContain("20");
  });
});

// ─── generateId ───────────────────────────────────────────────────────────────

describe("generateId", () => {
  it("should generate a string", () => {
    expect(typeof generateId()).toBe("string");
  });

  it("should generate unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it("should contain a timestamp component", () => {
    const id = generateId();
    const timestamp = parseInt(id.split("-")[0], 10);
    expect(timestamp).toBeGreaterThan(0);
    expect(timestamp).toBeLessThanOrEqual(Date.now());
  });
});

// ─── debounce ─────────────────────────────────────────────────────────────────

describe("debounce", () => {
  it("should delay execution", async () => {
    let callCount = 0;
    const fn = debounce(() => {
      callCount++;
    }, 50);

    fn();
    fn();
    fn();
    expect(callCount).toBe(0);

    await new Promise((r) => setTimeout(r, 100));
    expect(callCount).toBe(1);
  });
});

// ─── safeLocalStorage ─────────────────────────────────────────────────────────

describe("safeLocalStorageGet / safeLocalStorageSet", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return fallback when key does not exist", () => {
    expect(safeLocalStorageGet("missing", "default")).toBe("default");
  });

  it("should set and get a value", () => {
    safeLocalStorageSet("testKey", { a: 1 });
    expect(safeLocalStorageGet("testKey", null)).toEqual({ a: 1 });
  });

  it("should return fallback when stored value is invalid JSON", () => {
    localStorage.setItem("broken", "not-json");
    expect(safeLocalStorageGet("broken", "fallback")).toBe("fallback");
  });
});

// ─── cn (class name utility) ──────────────────────────────────────────────────

describe("cn", () => {
  it("should merge class names", () => {
    expect(cn("px-4", "py-2")).toContain("px-4");
    expect(cn("px-4", "py-2")).toContain("py-2");
  });

  it("should handle conditional classes", () => {
    const result = cn("base", false && "hidden", "active");
    expect(result).toContain("base");
    expect(result).toContain("active");
    expect(result).not.toContain("hidden");
  });

  it("should merge tailwind conflicts", () => {
    // twMerge should keep the last conflicting class
    const result = cn("px-4", "px-8");
    expect(result).toBe("px-8");
  });
});
