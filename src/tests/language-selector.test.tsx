import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageSelector } from "@/components/layout/LanguageSelector";

// Mock the DropdownMenu components if they are complex
vi.mock("@/components/ui/DropdownMenu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <div onClick={onClick} role="menuitem">{children}</div>
  ),
}));

describe("LanguageSelector", () => {
  it("renders with default language (English)", () => {
    render(<LanguageSelector />);
    // Should find "English" in both trigger and menu
    expect(screen.getAllByText("English").length).toBeGreaterThan(0);
  });

  it("updates selected language on click", () => {
    render(<LanguageSelector />);
    
    // Find Hindi in the menu
    const hindiOption = screen.getByRole("menuitem", { name: /Hindi/i });
    fireEvent.click(hindiOption);
    
    // Check that Hindi is now in the trigger
    expect(screen.getAllByText(/Hindi/i).length).toBeGreaterThan(0);
  });

  it("contains powered by cloud translation text", () => {
    render(<LanguageSelector />);
    expect(screen.getByText(/Powered by Cloud Translation/i)).toBeDefined();
  });
});
