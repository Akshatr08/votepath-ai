"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./AuthProvider";
import { AccessibilityProvider } from "./AccessibilityProvider";

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
          {children}
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
