import { describe, it, expect, vi } from "vitest";
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  getUserChecklist,
  saveUserChecklist,
  updateChecklistItem,
  logAnalyticsEvent,
  logQueryInsight,
} from "@/lib/firestore";

describe("Firestore Operations", () => {
  it("getUserProfile should return null on error", async () => {
    const result = await getUserProfile("nonexistent-uid");
    expect(result).toBeNull();
  });

  it("createUserProfile should call setDoc", async () => {
    const { setDoc } = await import("firebase/firestore");
    await createUserProfile({
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: null,
      country: "IN",
      state: "Maharashtra",
      age: 25,
      isFirstTimeVoter: true,
      preferredLanguage: "en",
      votingMethod: "both",
      onboardingComplete: false,
    });
    expect(setDoc).toHaveBeenCalled();
  });

  it("updateUserProfile should call updateDoc", async () => {
    const { updateDoc } = await import("firebase/firestore");
    await updateUserProfile("test-uid", { age: 26 });
    expect(updateDoc).toHaveBeenCalled();
  });

  it("getUserChecklist should return null on error", async () => {
    const result = await getUserChecklist("nonexistent-uid");
    expect(result).toBeNull();
  });

  it("saveUserChecklist should call addDoc", async () => {
    const { addDoc } = await import("firebase/firestore");
    (addDoc as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ id: "chk-123" });
    const id = await saveUserChecklist("uid", "Maharashtra", []);
    expect(id).toBe("chk-123");
  });

  it("logAnalyticsEvent should not throw on server side", async () => {
    await expect(logAnalyticsEvent("test_event", { key: "value" })).resolves.not.toThrow();
  });

  it("logQueryInsight should handle errors gracefully", async () => {
    const { addDoc } = await import("firebase/firestore");
    (addDoc as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Firestore error"));
    await expect(
      logQueryInsight({
        query: "test",
        sentiment: 0.5,
        entities: ["Election"],
        timestamp: new Date(),
      })
    ).resolves.not.toThrow();
  });
});
