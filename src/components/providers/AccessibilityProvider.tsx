"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type FontSize = "small" | "medium" | "large" | "xlarge";

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useLocalStorage<FontSize>("vp_font_size", "medium");
  const [highContrast, setHighContrast] = useLocalStorage<boolean>("vp_high_contrast", false);

  useEffect(() => {
    const root = document.documentElement;
    
    // Handle font size
    root.classList.remove("text-small", "text-medium", "text-large", "text-xlarge");
    root.classList.add(`text-${fontSize}`);
    
    // Handle high contrast
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [fontSize, highContrast]);

  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize, highContrast, setHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
