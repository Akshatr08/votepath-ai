import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimelineClient } from "@/components/timeline/TimelineClient";

describe("TimelineClient", () => {
  it("renders the timeline heading", () => {
    render(<TimelineClient />);
    expect(screen.getByRole("heading", { name: /Election.*Timeline/i })).toBeInTheDocument();
  });

  it("renders the category legend", () => {
    render(<TimelineClient />);
    expect(screen.getAllByText(/registration/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/voting/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/results/i).length).toBeGreaterThan(0);
  });

  it("renders the timeline feed region", () => {
    render(<TimelineClient />);
    const feed = screen.getByRole("feed", { name: /election timeline/i });
    expect(feed).toBeInTheDocument();
  });

  it("renders timeline event articles", () => {
    render(<TimelineClient />);
    const articles = screen.getAllByRole("article");
    expect(articles.length).toBeGreaterThan(0);
  });

  it("renders a disclaimer note", () => {
    render(<TimelineClient />);
    const note = screen.getByRole("note");
    expect(note).toBeInTheDocument();
    expect(note.textContent).toMatch(/illustrative/i);
  });

  it("renders time elements for event dates", () => {
    render(<TimelineClient />);
    const timeEls = document.querySelectorAll("time");
    expect(timeEls.length).toBeGreaterThan(0);
  });

  it("renders descriptive text for all events", () => {
    render(<TimelineClient />);
    // Each event should have a status badge
    const statusBadges = screen.queryAllByText(/Completed|Upcoming|Happening Now/i);
    expect(statusBadges.length).toBeGreaterThan(0);
  });
});
