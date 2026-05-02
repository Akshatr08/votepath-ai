"use client";

/**
 * React Error Boundary.
 *
 * Catches unhandled JavaScript errors in the component tree and renders
 * a user-friendly fallback UI instead of a blank screen. Includes a
 * retry button to attempt re-rendering the failed subtree.
 *
 * @module components/providers/ErrorBoundary
 */

import { Component, type ErrorInfo, type ReactNode } from "react";

/** Props accepted by the {@link ErrorBoundary} component. */
interface ErrorBoundaryProps {
  /** The child components to wrap with error handling. */
  children: ReactNode;
  /** Optional custom fallback UI. When omitted, a default error card is rendered. */
  fallback?: ReactNode;
}

/** Internal state tracking whether an error has been caught. */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Class-based React Error Boundary.
 *
 * Wraps a subtree to gracefully catch rendering errors and display
 * a recoverable fallback UI.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-4">
            <span className="text-2xl" aria-hidden="true">⚠️</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md">
            An unexpected error occurred. Please try again or refresh the page.
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="mt-4 p-4 rounded-xl bg-secondary text-xs text-left max-w-lg overflow-auto">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
