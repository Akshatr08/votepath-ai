import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/google-cloud", () => ({
  translateText: vi.fn().mockResolvedValue("अनुवादित पाठ"),
}));

import { POST } from "@/app/api/translate/route";
import { NextRequest } from "next/server";

describe("Translate API Route", () => {
  it("should translate text successfully", async () => {
    const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: "Hello", targetLanguage: "hi" }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });

  it("should reject missing text", async () => {
    const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: JSON.stringify({ targetLanguage: "hi" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should reject missing targetLanguage", async () => {
    const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: "Hello" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should reject invalid JSON body", async () => {
    const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
