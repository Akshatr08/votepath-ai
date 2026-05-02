"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, MessageCircle, Sparkles } from "lucide-react";
import { FAQ_DATA } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { FAQItem as FAQItemType } from "@/types";

const CATEGORIES = ["All", ...Array.from(new Set(FAQ_DATA.map((f) => f.category)))];

function FAQItem({ item, index }: { item: (typeof FAQ_DATA)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div
        className={cn(
          "rounded-xl border transition-all duration-200",
          open ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/20"
        )}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`faq-answer-${item.id}`}
          id={`faq-question-${item.id}`}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
        >
          <span className="font-semibold text-sm sm:text-base">{item.question}</span>
          <ChevronDown
            className={cn("w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={`faq-answer-${item.id}`}
              role="region"
              aria-labelledby={`faq-question-${item.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
                {item.answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function FAQClient(): JSX.Element {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [semanticResults, setSemanticResults] = useState<FAQItemType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSemanticSearch = async () => {
    if (!search.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch("/api/faq/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: search }),
      });
      const json = await res.json();
      if (json.success) {
        setSemanticResults(json.data);
      }
    } catch {
      // User-facing error is not actionable; search falls back to local filter
    } finally {
      setIsSearching(false);
    }
  };

  const filtered = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCat = category === "All" || item.category === category;
      const matchesSearch =
        !search ||
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [search, category]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-blue-500" aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-extrabold mb-3">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h1>
        <p className="text-muted-foreground">
          Everything you need to know about voting and elections — answered clearly.
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <input
          id="faq-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions…"
          aria-label="Search FAQ questions"
          className="w-full pl-11 pr-24 py-3 rounded-xl border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={handleSemanticSearch}
          disabled={!search || isSearching}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 transition-all shadow-sm"
        >
          {isSearching ? (
            <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          AI Search
        </button>
      </div>

      {/* Category Filter */}
      <div
        className="flex flex-wrap gap-2 mb-8"
        role="group"
        aria-label="Filter by category"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              category === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-3" role="list" aria-label="FAQ items">
        {filtered.length > 0 ? (
          filtered.map((item, i) => (
            <div key={item.id} role="listitem">
              <FAQItem item={item} index={i} />
            </div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
            role="status"
            aria-live="polite"
          >
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" aria-hidden="true" />
            <p className="text-muted-foreground">No questions found. Try asking our AI assistant!</p>
          </motion.div>
        )}
      </div>

      {/* Semantic Results */}
      <AnimatePresence>
        {semanticResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-12 pt-10 border-t border-border/50"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Semantic Matches</h2>
              <button 
                onClick={() => setSemanticResults([])}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </div>
            <div className="space-y-3">
              {semanticResults.map((item, i) => (
                <div key={`semantic-${item.id}`} role="listitem">
                  <FAQItem item={item} index={i} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 p-6 rounded-2xl border border-primary/30 bg-primary/5 text-center"
      >
        <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" aria-hidden="true" />
        <h2 className="font-bold text-lg mb-2">Didn&apos;t find your answer?</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Our AI assistant can answer any specific question about elections.
        </p>
        <Button asChild variant="gradient">
          <Link href="/dashboard#assistant">Ask AI Assistant</Link>
        </Button>
      </motion.div>
    </div>
  );
}
