import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";

vi.mock("@/lib/firestore", () => ({
  getUserProfile: vi.fn(),
  createUserProfile: vi.fn(),
  updateUserProfile: vi.fn(),
  logAnalyticsEvent: vi.fn(),
  logQueryInsight: vi.fn(),
  getUserChecklist: vi.fn(),
  saveUserChecklist: vi.fn(),
  updateChecklistItem: vi.fn(),
}));

import { getUserProfile, createUserProfile } from "@/lib/firestore";

// These are already mocked by setup.ts — vi.mocked gives us type-safe access
const mockOnAuthStateChanged = vi.mocked(onAuthStateChanged);
const mockSignInWithPopup = vi.mocked(signInWithPopup);
const mockSignOut = vi.mocked(signOut);
const mockGetUserProfile = vi.mocked(getUserProfile);
const mockCreateUserProfile = vi.mocked(createUserProfile);

describe("useAuth Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading state", () => {
    mockOnAuthStateChanged.mockReturnValue(() => {});
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should set user to null when no user is signed in", async () => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      if (typeof callback === "function") {
        (callback as (user: User | null) => void)(null);
      }
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should set user when signed in and create profile for new users", async () => {
    const mockUser = {
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: null,
    } as unknown as User;

    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      if (typeof callback === "function") {
        (callback as (user: User | null) => void)(mockUser);
      }
      return () => {};
    });

    const mockProfile = {
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: null,
      country: "",
      state: "",
      age: 0,
      isFirstTimeVoter: false,
      preferredLanguage: "en" as const,
      votingMethod: "both" as const,
      onboardingComplete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // First call returns null (new user), second call returns created profile
    mockGetUserProfile
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockProfile);
    mockCreateUserProfile.mockResolvedValue();

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeTruthy();
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockCreateUserProfile).toHaveBeenCalled();
  });

  it("should handle signInWithGoogle errors", async () => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      if (typeof callback === "function") {
        (callback as (user: User | null) => void)(null);
      }
      return () => {};
    });

    mockSignInWithPopup.mockRejectedValue(new Error("Popup closed"));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(result.current.error).toBe("Popup closed");
  });

  it("should handle logout errors", async () => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      if (typeof callback === "function") {
        (callback as (user: User | null) => void)(null);
      }
      return () => {};
    });

    mockSignOut.mockRejectedValue(new Error("Sign out failed"));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.error).toBe("Sign out failed");
  });

  it("should unsubscribe from auth listener on unmount", () => {
    const unsubscribe = vi.fn();
    mockOnAuthStateChanged.mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useAuth());
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
