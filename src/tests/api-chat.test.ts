import { describe, it, expect, vi } from "vitest";
import { POST, OPTIONS } from "@/app/api/chat/route";
import { NextRequest } from "next/server";

vi.mock("@/lib/gemini", () => ({
  getGeminiModel: () => ({
    startChat: () => ({
      sendMessage: vi.fn().mockResolvedValue({
        response: { text: () => "Here is your voting information." },
      }),
    }),
  }),
}));

vi.mock("@/lib/google-cloud", () => ({
  analyzeSentiment: vi.fn().mockResolvedValue({ score: 0.5 }),
  analyzeEntities: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/firestore", () => ({
  logQueryInsight: vi.fn().mockResolvedValue(undefined),
}));

describe("Chat API Route", () => {
  it("returns 200 with AI response for valid input", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "How do I register to vote?", history: [], userId: "u1" }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.text).toBeDefined();
  });

  it("returns 400 for invalid JSON", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing message field", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ history: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for empty message after sanitization", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "<script></script>", history: [], userId: "u1" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns X-RateLimit headers on success", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "Who can vote?", history: [], userId: "u1" }),
    });
    const res = await POST(req);
    expect(res.headers.get("X-RateLimit-Remaining")).not.toBeNull();
    expect(res.headers.get("X-RateLimit-Reset")).not.toBeNull();
  });

  it("OPTIONS returns 204", async () => {
    const res = await OPTIONS();
    expect(res.status).toBe(204);
  });

  it("sanitizes HTML tags from message before processing", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "<b>How to vote?</b>", history: [], userId: "u1" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
