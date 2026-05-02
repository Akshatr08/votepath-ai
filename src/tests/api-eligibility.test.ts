import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/eligibility/route";
import { NextRequest } from "next/server";

describe("Eligibility API Route", () => {
  it("should return eligible for valid citizen over 18", async () => {
    const req = new NextRequest("http://localhost/api/eligibility", {
      method: "POST",
      body: JSON.stringify({
        age: 25,
        isCitizen: true,
        isResident: true,
        country: "IN",
        region: "Maharashtra",
        residencyStatus: "citizen",
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.eligible).toBe(true);
    expect(data.data.disclaimer).toBeDefined();
  });

  it("should return ineligible for minor", async () => {
    const req = new NextRequest("http://localhost/api/eligibility", {
      method: "POST",
      body: JSON.stringify({
        age: 16,
        isCitizen: true,
        isResident: true,
        country: "IN",
        region: "Delhi",
        residencyStatus: "citizen",
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.eligible).toBe(false);
  });

  it("should reject invalid body", async () => {
    const req = new NextRequest("http://localhost/api/eligibility", {
      method: "POST",
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should reject missing fields", async () => {
    const req = new NextRequest("http://localhost/api/eligibility", {
      method: "POST",
      body: JSON.stringify({ age: 25 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should reject negative age", async () => {
    const req = new NextRequest("http://localhost/api/eligibility", {
      method: "POST",
      body: JSON.stringify({
        age: -5,
        isCitizen: true,
        isResident: true,
        region: "Test",
        residencyStatus: "citizen",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should reject invalid residencyStatus", async () => {
    const req = new NextRequest("http://localhost/api/eligibility", {
      method: "POST",
      body: JSON.stringify({
        age: 25,
        isCitizen: true,
        isResident: true,
        region: "Test",
        residencyStatus: "alien",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
