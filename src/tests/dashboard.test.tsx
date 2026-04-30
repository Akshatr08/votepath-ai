import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

// Mock Auth
vi.mock("@/components/providers/AuthProvider", () => ({
  useAuthContext: () => ({
    isAuthenticated: true,
    user: { displayName: "Test User", uid: "123" },
    profile: { onboardingComplete: true },
    loading: false,
  }),
}));

// Mock components that might be heavy
vi.mock("@/components/dashboard/OnboardingWizard", () => ({
  OnboardingWizard: () => <div>Onboarding Wizard</div>,
}));

describe("DashboardClient", () => {
  it("should render welcome message for authenticated user", () => {
    render(<DashboardClient />);
    expect(screen.getByText(/Welcome back, Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Election Journey/i)).toBeInTheDocument();
  });

  it("should show key navigation cards", () => {
    render(<DashboardClient />);
    expect(screen.getByText(/Election Roadmap/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Checklist/i)).toBeInTheDocument();
  });
});
