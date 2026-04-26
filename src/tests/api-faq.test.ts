import { describe, it, expect, vi } from "vitest";
import { POST } from "@/app/api/faq/search/route";
import { NextRequest } from "next/server";

// Mock the dependencies
vi.mock("@/lib/google-cloud", () => ({
  getEmbeddings: vi.fn().mockResolvedValue([0.1, 0.2, 0.3]),
}));

describe("FAQ Search API", () => {
  it("should return matches for a valid query", async () => {
    const request = new NextRequest("http://localhost/api/faq/search", {
      method: "POST",
      body: JSON.stringify({ query: "How do I register?" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });

  it("should return 400 for missing query", async () => {
    const request = new NextRequest("http://localhost/api/faq/search", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
