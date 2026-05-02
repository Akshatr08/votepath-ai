"use client";

/**
 * Root provider composition.
 *
 * Wraps the application in theme, auth, accessibility, and error-handling providers.
 * Order matters: ErrorBoundary is innermost so it catches component errors
 * while still having access to all context providers above it.
 *
 * @module components/providers/Providers
 */

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./AuthProvider";
import { AccessibilityProvider } from "./AccessibilityProvider";
import { ErrorBoundary } from "./ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <AuthProvider>
        <AccessibilityProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toaster
            position="top-right"
            toastOptions={{
              className: "!bg-card !text-card-foreground !border !border-border",
              duration: 4000,
              style: {
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
              },
            }}
          />
        </AccessibilityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
