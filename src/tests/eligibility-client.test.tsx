import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EligibilityClient } from "@/components/eligibility/EligibilityClient";

// Mock the AuthProvider context
vi.mock("@/components/providers/AuthProvider", () => ({
  useAuthContext: () => ({
    isAuthenticated: false,
    user: null,
    profile: null,
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("EligibilityClient Component", () => {
  it("should show eligibility form and handle submission", async () => {
    // Override fetch mock for this test
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          eligible: true,
          confidence: "high",
          reasons: ["You are likely eligible to vote!"],
          nextSteps: ["Register now"],
          disclaimer: "Disclaimer text"
        }
      }),
    });

    render(<EligibilityClient />);
    
    expect(screen.getByRole("heading", { name: /Eligibility/i })).toBeInTheDocument();
    
    const regionInput = screen.getByLabelText(/State \/ Region/i);
    fireEvent.change(regionInput, { target: { value: "Maharashtra" } });
    
    const ageInput = screen.getByLabelText(/Your Age/i);
    fireEvent.change(ageInput, { target: { value: "20" } });
    
    const submitBtn = screen.getByRole("button", { name: /Check My Eligibility/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/You are likely eligible to vote!/i)).toBeInTheDocument();
    });
  });

  it("should show ineligibility for under 18", async () => {
    // Override fetch mock for this test
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          eligible: false,
          confidence: "high",
          reasons: ["You are not eligible to vote yet"],
          nextSteps: ["Wait until you are 18"],
          disclaimer: "Disclaimer text"
        }
      }),
    });

    render(<EligibilityClient />);
    
    const regionInput = screen.getByLabelText(/State \/ Region/i);
    fireEvent.change(regionInput, { target: { value: "California" } });
    
    const ageInput = screen.getByLabelText(/Your Age/i);
    fireEvent.change(ageInput, { target: { value: "16" } });
    
    const submitBtn = screen.getByRole("button", { name: /Check My Eligibility/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/You are not eligible to vote yet/i)).toBeInTheDocument();
    });
  });

  it("renders all form fields", () => {
    render(<EligibilityClient />);
    expect(screen.getByLabelText(/Your Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State \/ Region/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Residency Status/i)).toBeInTheDocument();
  });

  it("renders citizenship and residency checkboxes", () => {
    render(<EligibilityClient />);
    expect(screen.getByLabelText(/citizen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/residing/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<EligibilityClient />);
    expect(screen.getByRole("button", { name: /Check My Eligibility/i })).toBeInTheDocument();
  });

  it("country select defaults to India (IN)", () => {
    render(<EligibilityClient />);
    const select = screen.getByLabelText(/Your Country/i) as HTMLSelectElement;
    expect(select.value).toBe("IN");
  });

  it("form has accessible aria-label", () => {
    render(<EligibilityClient />);
    expect(screen.getByRole("form", { name: /Eligibility check form/i })).toBeInTheDocument();
  });

  it("shows API error message in alert role", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ success: false, error: "Server error" }),
    });
    render(<EligibilityClient />);
    fireEvent.change(screen.getByLabelText(/State \/ Region/i), { target: { value: "Delhi" } });
    fireEvent.change(screen.getByLabelText(/Your Age/i), { target: { value: "22" } });
    fireEvent.click(screen.getByRole("button", { name: /Check My Eligibility/i }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows disclaimer in result", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          eligible: true,
          confidence: "high",
          reasons: ["Eligible!"],
          nextSteps: ["Register"],
          disclaimer: "Always verify with official sources.",
        },
      }),
    });
    render(<EligibilityClient />);
    fireEvent.change(screen.getByLabelText(/State \/ Region/i), { target: { value: "Delhi" } });
    fireEvent.change(screen.getByLabelText(/Your Age/i), { target: { value: "22" } });
    fireEvent.click(screen.getByRole("button", { name: /Check My Eligibility/i }));
    await waitFor(() => {
      expect(screen.getByText(/Always verify/i)).toBeInTheDocument();
    });
  });
});
