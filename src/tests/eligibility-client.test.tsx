import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EligibilityClient } from "@/components/eligibility/EligibilityClient";
import { AuthProvider } from "@/components/providers/AuthProvider";

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
    render(<EligibilityClient />);
    
    expect(screen.getByText(/Check Your Eligibility/i)).toBeInTheDocument();
    
    const regionInput = screen.getByLabelText(/Region/i);
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
    render(<EligibilityClient />);
    
    const regionInput = screen.getByLabelText(/Region/i);
    fireEvent.change(regionInput, { target: { value: "California" } });
    
    const ageInput = screen.getByLabelText(/Your Age/i);
    fireEvent.change(ageInput, { target: { value: "16" } });
    
    const submitBtn = screen.getByRole("button", { name: /Check My Eligibility/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/You are not eligible to vote yet/i)).toBeInTheDocument();
    });
  });
});
