import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LandingPage } from "@/components/landing/LandingPage";

// Mock next/dynamic (ThreeBackground is lazy-loaded)
vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="three-background" />,
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("LandingPage", () => {
  it("renders the main heading", () => {
    render(<LandingPage />);
    expect(screen.getByRole("heading", { name: /Understand Elections/i })).toBeInTheDocument();
  });

  it("renders the Start Your Journey CTA button", () => {
    render(<LandingPage />);
    const ctaLinks = screen.getAllByRole("link", { name: /Start Your Journey/i });
    expect(ctaLinks.length).toBeGreaterThan(0);
  });

  it("renders the Check Eligibility CTA", () => {
    render(<LandingPage />);
    const eligibilityLinks = screen.getAllByRole("link", { name: /Check Eligibility/i });
    expect(eligibilityLinks.length).toBeGreaterThan(0);
  });

  it("renders core feature cards", () => {
    render(<LandingPage />);
    expect(screen.getByText(/AI Election Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Eligibility Checker/i)).toBeInTheDocument();
    expect(screen.getByText(/Polling Locator/i)).toBeInTheDocument();
  });

  it("renders How It Works steps", () => {
    render(<LandingPage />);
    expect(screen.getAllByText(/Tell Us About You/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Get Your Roadmap/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ask the AI Assistant/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vote Confidently/i).length).toBeGreaterThan(0);
  });

  it("renders stat highlights", () => {
    render(<LandingPage />);
    expect(screen.getByText(/Non-Partisan/i)).toBeInTheDocument();
    expect(screen.getAllByText(/100%/).length).toBeGreaterThan(0);
  });

  it("renders the myths vs facts section", () => {
    render(<LandingPage />);
    expect(screen.getAllByText(/Fact/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/MYTH/i).length).toBeGreaterThan(0);
  });

  it("renders navigation links to app pages", () => {
    render(<LandingPage />);
    const dashboardLinks = screen.getAllByRole("link").filter(
      (el) => (el as HTMLAnchorElement).href?.includes("/dashboard")
    );
    expect(dashboardLinks.length).toBeGreaterThan(0);
  });
});
