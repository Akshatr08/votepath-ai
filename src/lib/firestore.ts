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
} from "firebase/firestore";
import { db } from "./firebase";
import type { UserProfile, SavedChecklist, ChecklistItem } from "@/types";

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
    } as UserProfile;
  } catch {
    return null;
  }
}

export async function createUserProfile(profile: Omit<UserProfile, "createdAt" | "updatedAt">): Promise<void> {
  const ref = doc(db, "users", profile.uid);
  await setDoc(ref, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

// ─── Checklist ────────────────────────────────────────────────────────────────

export async function getUserChecklist(userId: string): Promise<SavedChecklist | null> {
  try {
    const q = query(collection(db, "checklists"), where("userId", "==", userId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docData = snap.docs[0];
    const data = docData.data();
    return {
      ...data,
      id: docData.id,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
    } as SavedChecklist;
  } catch {
    return null;
  }
}

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

export async function updateChecklistItem(
  checklistId: string,
  items: ChecklistItem[]
): Promise<void> {
  const ref = doc(db, "checklists", checklistId);
  await updateDoc(ref, { items, updatedAt: serverTimestamp() });
}

// ─── Analytics Event Helper ───────────────────────────────────────────────────

export async function logAnalyticsEvent(event: string, params?: Record<string, unknown>): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const { analyticsPromise } = await import("./firebase");
    const analytics = await analyticsPromise;
    if (!analytics) return;
    const { logEvent } = await import("firebase/analytics");
    logEvent(analytics, event, params);
  } catch {
    // silently fail
  }
}

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
