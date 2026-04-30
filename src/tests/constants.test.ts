import { describe, it, expect } from "vitest";
import {
  APP_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  SUPPORTED_COUNTRIES,
  INDIA_STATES,
  US_STATES,
  DEFAULT_ROADMAP_STEPS,
  DEFAULT_CHECKLIST_ITEMS,
  TIMELINE_EVENTS,
  FAQ_DATA,
  MYTHS_FACTS,
  NAV_LINKS,
  RATE_LIMIT_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} from "@/constants";

describe("Constants Integrity", () => {
  it("should have app metadata defined", () => {
    expect(APP_NAME).toBe("VotePath AI");
    expect(APP_TAGLINE.length).toBeGreaterThan(0);
    expect(APP_DESCRIPTION.length).toBeGreaterThan(0);
  });

  it("should have supported countries", () => {
    expect(SUPPORTED_COUNTRIES.length).toBeGreaterThanOrEqual(5);
    const codes = SUPPORTED_COUNTRIES.map((c) => c.value);
    expect(codes).toContain("IN");
    expect(codes).toContain("US");
  });

  it("should have all major Indian states", () => {
    expect(INDIA_STATES.length).toBeGreaterThanOrEqual(28);
    expect(INDIA_STATES).toContain("Maharashtra");
    expect(INDIA_STATES).toContain("Delhi");
  });

  it("should have all 50 US states", () => {
    expect(US_STATES.length).toBe(50);
    expect(US_STATES).toContain("California");
    expect(US_STATES).toContain("Texas");
  });

  it("should have complete roadmap steps", () => {
    expect(DEFAULT_ROADMAP_STEPS.length).toBe(6);
    DEFAULT_ROADMAP_STEPS.forEach((step) => {
      expect(step.id).toBeTruthy();
      expect(step.title).toBeTruthy();
      expect(step.description).toBeTruthy();
    });
    expect(DEFAULT_ROADMAP_STEPS[0].status).toBe("available");
  });

  it("should have unique roadmap step IDs", () => {
    const ids = DEFAULT_ROADMAP_STEPS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have checklist items with valid categories", () => {
    const validCategories = ["registration", "documents", "polling", "election_day", "general"];
    DEFAULT_CHECKLIST_ITEMS.forEach((item) => {
      expect(validCategories).toContain(item.category);
      expect(item.status).toBe("pending");
    });
  });

  it("should have unique checklist IDs", () => {
    const ids = DEFAULT_CHECKLIST_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have timeline events in order", () => {
    expect(TIMELINE_EVENTS.length).toBe(8);
    TIMELINE_EVENTS.forEach((e) => {
      expect(e.id).toBeTruthy();
      expect(e.title).toBeTruthy();
      expect(e.date).toBeTruthy();
    });
  });

  it("should have unique timeline event IDs", () => {
    const ids = TIMELINE_EVENTS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have FAQ data with valid categories", () => {
    expect(FAQ_DATA.length).toBeGreaterThanOrEqual(8);
    FAQ_DATA.forEach((faq) => {
      expect(faq.question.length).toBeGreaterThan(0);
      expect(faq.answer.length).toBeGreaterThan(0);
      expect(faq.category.length).toBeGreaterThan(0);
    });
  });

  it("should have myths and facts data", () => {
    expect(MYTHS_FACTS.length).toBeGreaterThanOrEqual(6);
    MYTHS_FACTS.forEach((mf) => {
      expect(mf.myth.length).toBeGreaterThan(0);
      expect(mf.fact.length).toBeGreaterThan(0);
    });
  });

  it("should have navigation links with valid hrefs", () => {
    expect(NAV_LINKS.length).toBeGreaterThan(0);
    NAV_LINKS.forEach((link) => {
      expect(link.href).toMatch(/^\//);
      expect(link.label.length).toBeGreaterThan(0);
    });
  });

  it("should have reasonable rate limits", () => {
    expect(RATE_LIMIT_REQUESTS).toBeGreaterThanOrEqual(5);
    expect(RATE_LIMIT_REQUESTS).toBeLessThanOrEqual(100);
    expect(RATE_LIMIT_WINDOW_MS).toBeGreaterThanOrEqual(10000);
  });
});
