/**
 * Firestore data access layer.
 *
 * Provides CRUD operations for user profiles, checklists, analytics events,
 * and query insights. All functions handle errors gracefully and use
 * server-side timestamps for consistency.
 *
 * @module lib/firestore
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import type { UserProfile, SavedChecklist, ChecklistItem } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Safely converts a Firestore `Timestamp` field to a JavaScript `Date`.
 * Returns the current date as a fallback if the field is missing or not a Timestamp.
 */
function toDate(field: unknown): Date {
  if (field instanceof Timestamp) return field.toDate();
  if (field instanceof Date) return field;
  return new Date();
}

/**
 * Maps a raw Firestore document to a typed `UserProfile`, converting Timestamp fields.
 */
function mapToUserProfile(data: DocumentData): UserProfile {
  return {
    uid: data.uid as string,
    email: (data.email as string | null) ?? null,
    displayName: (data.displayName as string | null) ?? null,
    photoURL: (data.photoURL as string | null) ?? null,
    country: data.country as string,
    state: data.state as string,
    age: data.age as number,
    isFirstTimeVoter: data.isFirstTimeVoter as boolean,
    preferredLanguage: data.preferredLanguage as "en" | "hi",
    votingMethod: data.votingMethod as "online" | "offline" | "both",
    onboardingComplete: data.onboardingComplete as boolean,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

// ─── User Profile ─────────────────────────────────────────────────────────────

/**
 * Fetches a user profile from the `users` collection by UID.
 *
 * @param uid - The Firebase Auth UID of the user.
 * @returns The user profile, or `null` if not found or on error.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return mapToUserProfile(snap.data());
  } catch {
    return null;
  }
}

/**
 * Creates a new user profile document with server-side timestamps.
 *
 * @param profile - The profile data (excluding managed timestamp fields).
 */
export async function createUserProfile(profile: Omit<UserProfile, "createdAt" | "updatedAt">): Promise<void> {
  const ref = doc(db, "users", profile.uid);
  await setDoc(ref, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Partially updates an existing user profile and refreshes the `updatedAt` timestamp.
 *
 * @param uid - The Firebase Auth UID of the user.
 * @param data - A partial object of fields to update.
 */
export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

// ─── Checklist ────────────────────────────────────────────────────────────────

/**
 * Retrieves the first checklist document for a given user.
 *
 * @param userId - The Firebase Auth UID of the checklist owner.
 * @returns The saved checklist, or `null` if none exists or on error.
 */
export async function getUserChecklist(userId: string): Promise<SavedChecklist | null> {
  try {
    const q = query(collection(db, "checklists"), where("userId", "==", userId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      userId: data.userId as string,
      region: data.region as string,
      items: data.items as ChecklistItem[],
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    };
  } catch {
    return null;
  }
}

/**
 * Saves a new checklist document to Firestore.
 *
 * @param userId - The Firebase Auth UID of the checklist owner.
 * @param region - The user's region/state for contextual checklist content.
 * @param items - The initial checklist items to persist.
 * @returns The Firestore document ID of the newly created checklist.
 */
export async function saveUserChecklist(
  userId: string,
  region: string,
  items: ChecklistItem[]
): Promise<string> {
  const ref = await addDoc(collection(db, "checklists"), {
    userId,
    region,
    items,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Updates the items array in an existing checklist document.
 *
 * @param checklistId - The Firestore document ID of the checklist.
 * @param items - The updated checklist items.
 */
export async function updateChecklistItem(
  checklistId: string,
  items: ChecklistItem[]
): Promise<void> {
  const ref = doc(db, "checklists", checklistId);
  await updateDoc(ref, { items, updatedAt: serverTimestamp() });
}

// ─── Analytics Event Helper ───────────────────────────────────────────────────

/**
 * Logs a custom analytics event to Firebase Analytics.
 * Only fires in the browser and silently fails if Analytics is unavailable.
 *
 * @param event - The event name (e.g., `"ai_question_asked"`).
 * @param params - Optional key-value parameters attached to the event.
 */
export async function logAnalyticsEvent(event: string, params?: Record<string, unknown>): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const { analyticsPromise } = await import("./firebase");
    const analytics = await analyticsPromise;
    if (!analytics) return;
    const { logEvent } = await import("firebase/analytics");
    logEvent(analytics, event, params);
  } catch {
    // Silently fail — analytics is non-critical
  }
}

/**
 * Persists a query insight document for analytics and NLP data tracking.
 *
 * @param insight - The insight data containing query text, sentiment score, and extracted entities.
 */
export async function logQueryInsight(insight: {
  userId?: string;
  query: string;
  sentiment: number;
  entities: string[];
  timestamp: Date;
}): Promise<void> {
  try {
    await addDoc(collection(db, "query_insights"), {
      ...insight,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to log query insight:", error);
  }
}
