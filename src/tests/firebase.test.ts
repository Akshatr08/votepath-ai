import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn().mockReturnValue([{}]), // Simulate already initialized
  getApp: vi.fn().mockReturnValue({}),
}));
vi.mock("firebase/auth", () => {
  return {
    getAuth: vi.fn(),
    GoogleAuthProvider: class {
      setCustomParameters = vi.fn();
    },
  };
});
vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
}));
vi.mock("firebase/analytics", () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn().mockResolvedValue(true),
}));

describe("Firebase Initialization", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should not re-initialize if app already exists", async () => {
    const firebaseApp = await import("firebase/app");
    (firebaseApp.getApps as any).mockReturnValue([{}]);
    
    await import("@/lib/firebase");
    
    expect(firebaseApp.getApps).toHaveBeenCalled();
    expect(firebaseApp.getApp).toHaveBeenCalled();
    expect(firebaseApp.initializeApp).not.toHaveBeenCalled();
  });
});
