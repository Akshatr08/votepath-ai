import { describe, it, expect, vi } from "vitest";
import { getGoogleCalendarLink } from "@/lib/calendar";

describe("Calendar Utility", () => {
  it("should generate a valid Google Calendar template link", () => {
    const title = "Vote on Election Day";
    const date = "2025-05-12";
    const description = "Bring your Voter ID";
    
    const link = getGoogleCalendarLink(title, date, description);
    
    expect(link).toContain("https://www.google.com/calendar/render?action=TEMPLATE");
    expect(link).toContain("text=Vote+on+Election+Day");
    expect(link).toContain("details=Bring+your+Voter+ID");
    // Date format check (YYYYMMDD)
    expect(link).toMatch(/dates=\d{8}T\d{6}Z/);
  });

  it("should handle different date formats", () => {
    const link = getGoogleCalendarLink("Test", "2025-05-12T00:00:00Z", "Desc");
    expect(link).toContain("dates=20250512T000000Z");
  });
});
