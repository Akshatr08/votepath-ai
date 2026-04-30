import { describe, it, expect } from "vitest";
import { getGoogleCalendarLink } from "@/lib/calendar";

describe("Calendar Utility (Extended)", () => {
  it("should generate a valid Google Calendar link", () => {
    const link = getGoogleCalendarLink("Vote Day", "2025-05-12", "Bring ID");
    expect(link).toContain("https://www.google.com/calendar/render?action=TEMPLATE");
    expect(link).toContain("text=Vote+Day");
    expect(link).toContain("details=Bring+ID");
    expect(link).toContain("location=Your+Local+Polling+Station");
  });

  it("should include start and end dates", () => {
    const link = getGoogleCalendarLink("Test", "2025-05-12", "Desc");
    expect(link).toMatch(/dates=\d{8}T\d{6}Z/);
    // End should be 1 hour after start
    expect(link).toContain("/");
  });

  it("should handle ISO date strings", () => {
    const link = getGoogleCalendarLink("Test", "2025-05-12T10:00:00Z", "Desc");
    expect(link).toContain("dates=20250512T100000Z");
  });

  it("should URL-encode special characters in title", () => {
    const link = getGoogleCalendarLink("Vote & Register!", "2025-05-12", "Desc");
    expect(link).toContain("text=Vote");
  });

  it("should URL-encode special characters in description", () => {
    const link = getGoogleCalendarLink("Test", "2025-05-12", "Bring ID & documents");
    expect(link).toContain("details=Bring+ID");
  });
});
