"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ChatMessage } from "@/types";
import { generateId, sanitizeInput, formatAIResponse } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { logAnalyticsEvent } from "@/lib/firestore";

const SUGGESTED_QUESTIONS = [
  "How do I register to vote?",
  "What ID do I need to vote?",
  "Can students vote away from home?",
  "How does absentee voting work?",
  "What happens on election day?",
];

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-3 max-w-full", isUser && "flex-row-reverse")}
    >
      {/* Avatar */}
      <div
        aria-hidden="true"
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white",
          isUser ? "bg-primary" : "bg-gradient-to-br from-blue-500 to-cyan-500"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 text-sm leading-relaxed",
          isUser ? "chat-bubble-user" : "chat-bubble-ai"
        )}
        aria-label={isUser ? "Your message" : "AI Assistant message"}
      >
        {msg.isLoading ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1" aria-label="AI is thinking" role="status">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="sr-only">AI is generating a response…</span>
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: formatAIResponse(msg.content) }}
          />
        )}
      </div>
    </motion.div>
  );
}

export function AIAssistant(): JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your VotePath AI assistant 🗳️\n\nI'm here to help you understand elections — from registration steps and required documents to election day procedures and your voting rights.\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildHistory = useCallback(() =>
    messages
      .filter((m) => !m.isLoading && m.id !== "welcome")
      .map((m) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: m.content }],
      }))
  , [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const messageText = sanitizeInput(text ?? input.trim());
    if (!messageText || isLoading) return;

    setInput("");
    setError(null);

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    const loadingMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: buildHistory(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Failed to get response");
      }

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.data.text,
        timestamp: new Date(),
      };

      setMessages((prev) => prev.filter((m) => !m.isLoading).concat(assistantMsg));
      await logAnalyticsEvent("ai_question_asked", { question_length: messageText.length });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => !m.isLoading));
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, buildHistory]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Chat cleared. How can I help you with elections?",
      timestamp: new Date(),
    }]);
    setError(null);
  };

  return (
    <div
      className="flex flex-col h-[600px] rounded-2xl border border-border bg-card overflow-hidden"
      role="region"
      aria-label="AI Election Assistant"
      id="assistant"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-bold text-sm">Election AI Assistant</h2>
            <p className="text-xs text-muted-foreground">Powered by Gemini · Neutral & Non-partisan</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          aria-label="Clear chat history"
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
        aria-live="polite"
        aria-atomic="false"
        role="log"
        aria-label="Chat messages"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive text-sm"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            {error}
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions */}
      <AnimatePresence>
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="px-5 pb-2"
          >
            <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Ask: ${q}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="px-5 py-4 border-t border-border bg-secondary/20">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about elections, registration, voting steps…"
            aria-label="Type your election question"
            rows={1}
            maxLength={1000}
            className="flex-1 resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all min-h-[44px] max-h-32"
            style={{ height: "auto" }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
            }}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            aria-busy={isLoading}
            size="icon"
            aria-label="Send message"
            id="chat-send-button"
            className="h-11 w-11 shrink-0"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          ⚠️ Verify details with official election authorities. Press Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
}
