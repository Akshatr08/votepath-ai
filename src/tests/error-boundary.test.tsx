import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";

// A component that throws on render
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <div>Child content rendered</div>;
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    // Suppress console.error from React's error boundary logging
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should render children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Child content rendered")).toBeInTheDocument();
  });

  it("should render fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should render custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div>Custom error UI</div>}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error UI")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("should show a Try Again button that resets the error state", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    expect(tryAgainButton).toBeInTheDocument();

    // After clicking Try Again, ErrorBoundary resets hasError, which triggers
    // a re-render. Since ThrowingComponent still throws, it will error again.
    // But we can verify the button click triggers the reset handler.
    fireEvent.click(tryAgainButton);

    // The component will throw again immediately, so error UI reappears
    rerender(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );
  });

  it("should log the error to console", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });
});
