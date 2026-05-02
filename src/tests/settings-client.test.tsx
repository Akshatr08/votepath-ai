import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsClient } from "@/components/settings/SettingsClient";

vi.mock("@/components/providers/AuthProvider", () => ({
  useAuthContext: () => ({
    isAuthenticated: false,
    user: null,
    profile: null,
    loading: false,
  }),
}));

vi.mock("@/components/providers/AccessibilityProvider", () => ({
  useAccessibility: () => ({
    fontSize: "medium",
    setFontSize: vi.fn(),
    highContrast: false,
    setHighContrast: vi.fn(),
  }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
  }),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

describe("SettingsClient", () => {
  it("renders the Settings heading", () => {
    render(<SettingsClient />);
    expect(screen.getByRole("heading", { name: /Settings/i })).toBeInTheDocument();
  });

  it("renders all section navigation buttons", () => {
    render(<SettingsClient />);
    expect(screen.getByRole("button", { name: /Profile/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Appearance/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Accessibility/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Privacy/i })).toBeInTheDocument();
  });

  it("renders sign-in prompt when unauthenticated", () => {
    render(<SettingsClient />);
    expect(screen.getByText(/Sign in to manage your profile/i)).toBeInTheDocument();
  });

  it("renders font size controls", () => {
    render(<SettingsClient />);
    expect(screen.getByRole("button", { name: /^Small$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Medium$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Large$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Xlarge$/i })).toBeInTheDocument();
  });

  it("renders High Contrast toggle", () => {
    render(<SettingsClient />);
    expect(screen.getByText(/High Contrast Mode/i)).toBeInTheDocument();
  });

  it("renders Dark Mode toggle", () => {
    render(<SettingsClient />);
    expect(screen.getByText(/Dark Mode/i)).toBeInTheDocument();
  });

  it("renders Save Changes button", () => {
    render(<SettingsClient />);
    expect(screen.getByRole("button", { name: /Save Changes/i })).toBeInTheDocument();
  });

  it("renders Reset Defaults button", () => {
    render(<SettingsClient />);
    expect(screen.getByRole("button", { name: /Reset Defaults/i })).toBeInTheDocument();
  });

  it("Save Changes button is clickable", () => {
    render(<SettingsClient />);
    const saveBtn = screen.getByRole("button", { name: /Save Changes/i });
    expect(() => fireEvent.click(saveBtn)).not.toThrow();
  });

  it("renders Preferred Language section", () => {
    render(<SettingsClient />);
    expect(screen.getByText(/Preferred Language/i)).toBeInTheDocument();
  });
});
