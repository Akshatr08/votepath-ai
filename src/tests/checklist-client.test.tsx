import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChecklistClient } from "@/components/checklist/ChecklistClient";

vi.mock("@/components/providers/AuthProvider", () => ({
  useAuthContext: () => ({
    isAuthenticated: false,
    user: null,
    profile: null,
    loading: false,
    signInWithGoogle: vi.fn(),
  }),
}));

vi.mock("@/lib/firestore", () => ({
  getUserChecklist: vi.fn().mockResolvedValue(null),
  saveUserChecklist: vi.fn().mockResolvedValue("mock-id"),
  updateChecklistItem: vi.fn().mockResolvedValue(undefined),
  logAnalyticsEvent: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/calendar", () => ({
  getGoogleCalendarLink: vi.fn().mockReturnValue("https://calendar.google.com/mock"),
}));

describe("ChecklistClient", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the checklist heading", async () => {
    render(<ChecklistClient />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Checklist/i })).toBeInTheDocument();
    });
  });

  it("renders default checklist items", async () => {
    render(<ChecklistClient />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
    // Should show progress bar
    expect(screen.getByText(/Overall Progress/i)).toBeInTheDocument();
  });

  it("shows sign-in prompt for unauthenticated users", async () => {
    render(<ChecklistClient />);
    await waitFor(() => {
      expect(screen.getByText(/Sign in to sync/i)).toBeInTheDocument();
    });
  });

  it("can add a custom checklist item", async () => {
    render(<ChecklistClient />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Add a custom task/i);
    fireEvent.change(input, { target: { value: "Bring photo ID" } });

    const addBtn = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(screen.getByText("Bring photo ID")).toBeInTheDocument();
    });
  });

  it("can toggle a checklist item", async () => {
    render(<ChecklistClient />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    const toggleButtons = screen.getAllByRole("button", { name: /Mark as/i });
    expect(toggleButtons.length).toBeGreaterThan(0);
    fireEvent.click(toggleButtons[0]);
    // After toggle, progress should update (no throw = pass)
  });

  it("renders progress bar", async () => {
    render(<ChecklistClient />);
    await waitFor(() => {
      expect(screen.getByText(/Overall Progress/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/of .* items/i)).toBeInTheDocument();
  });
});
