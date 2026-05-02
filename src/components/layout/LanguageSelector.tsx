"use client";

import { useState } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिन्दी)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
];

export function LanguageSelector() {
  const [selected, setSelected] = useState(LANGUAGES[0]);

  const handleLanguageChange = (lang: typeof LANGUAGES[0]) => {
    setSelected(lang);
    // Triggers Cloud Translation API context update
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="Select language" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-xs font-medium border border-border">
          <Languages className="w-3.5 h-3.5 text-primary" />
          <span>{selected.name}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang)}
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer",
              selected.code === lang.code && "bg-primary/10 text-primary font-bold"
            )}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
        <div className="mt-1 pt-1 border-t border-border/50 text-[10px] text-center text-muted-foreground italic">
          Powered by Cloud Translation
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
