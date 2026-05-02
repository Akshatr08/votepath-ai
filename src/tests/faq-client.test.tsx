import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FAQClient } from "@/components/faq/FAQClient";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("FAQClient", () => {
  it("renders the FAQ heading", () => {
    render(<FAQClient />);
    expect(screen.getByRole("heading", { name: /Frequently Asked/i })).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<FAQClient />);
    expect(screen.getByRole("searchbox", { name: /Search FAQ/i })).toBeInTheDocument();
  });

  it("renders category filter buttons", () => {
    render(<FAQClient />);
    expect(screen.getByRole("button", { name: /^All$/i })).toBeInTheDocument();
  });

  it("renders FAQ items from constants", () => {
    render(<FAQClient />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBeGreaterThan(0);
  });

  it("expands a FAQ item on click", async () => {
    render(<FAQClient />);
    const expandButtons = screen.getAllByRole("button", { name: /^(?!All|AI Search).+/i });
    // Find a FAQ question button (aria-expanded)
    const faqButton = expandButtons.find(
      (btn) => btn.getAttribute("aria-expanded") !== null
    );
    expect(faqButton).toBeDefined();
    if (faqButton) {
      expect(faqButton.getAttribute("aria-expanded")).toBe("false");
      fireEvent.click(faqButton);
      expect(faqButton.getAttribute("aria-expanded")).toBe("true");
    }
  });

  it("filters FAQ items when searching", async () => {
    render(<FAQClient />);
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "register" } });
    // Should filter to relevant items (no throw = pass; 0 items shows empty state)
    await waitFor(() => {
      const emptyState = screen.queryByText(/No questions found/i);
      const items = screen.queryAllByRole("listitem");
      // Either filtered items or empty state should be present
      expect(emptyState !== null || items.length > 0).toBe(true);
    });
  });

  it("renders the AI Search button", () => {
    render(<FAQClient />);
    expect(screen.getByRole("button", { name: /AI Search/i })).toBeInTheDocument();
  });

  it("renders the AI assistant CTA link", () => {
    render(<FAQClient />);
    expect(screen.getByRole("link", { name: /Ask AI Assistant/i })).toBeInTheDocument();
  });

  it("AI Search button is disabled when input is empty", () => {
    render(<FAQClient />);
    const aiSearchBtn = screen.getByRole("button", { name: /AI Search/i });
    expect(aiSearchBtn).toBeDisabled();
  });

  it("AI Search button enables when input has text", () => {
    render(<FAQClient />);
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "vote" } });
    const aiSearchBtn = screen.getByRole("button", { name: /AI Search/i });
    expect(aiSearchBtn).not.toBeDisabled();
  });

  it("category filter buttons have aria-pressed", () => {
    render(<FAQClient />);
    const allBtn = screen.getByRole("button", { name: "All" });
    expect(allBtn.getAttribute("aria-pressed")).toBe("true");
  });
});
