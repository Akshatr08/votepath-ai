"use client";

import { useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { getUserProfile, createUserProfile } from "@/lib/firestore";
import type { UserProfile } from "@/types";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let profile = await getUserProfile(user.uid);
        if (!profile) {
          // Create default profile for new users
          const newProfile: Omit<UserProfile, "createdAt" | "updatedAt"> = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            country: "",
            state: "",
            age: 0,
            isFirstTimeVoter: false,
            preferredLanguage: "en",
            votingMethod: "both",
            onboardingComplete: false,
          };
          await createUserProfile(newProfile);
          profile = await getUserProfile(user.uid);
        }
        setState({ user, profile, loading: false, error: null });
      } else {
        setState({ user: null, profile: null, loading: false, error: null });
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setState((prev) => ({ ...prev, error: message }));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign out failed";
      setState((prev) => ({ ...prev, error: message }));
    }
  }, []);

  return {
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    signInWithGoogle,
    logout,
  };
}
