/**
 * Firebase client SDK initialization.
 *
 * Configures Firebase Auth, Firestore, Analytics, and Google Sign-In provider.
 * Handles missing config gracefully during build time and prevents multiple
 * `initializeApp` calls in hot-reload scenarios.
 *
 * @module lib/firebase
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";

// Prevent multiple initializations and handle missing config during build
const app = getApps().length 
  ? getApp() 
  : initializeApp(isConfigValid ? firebaseConfig : { ...firebaseConfig, apiKey: "placeholder-for-build" });

/** Firebase Authentication instance. */
export const auth = getAuth(app);

/** Cloud Firestore database instance. */
export const db = getFirestore(app);

/** Google OAuth provider configured to always prompt for account selection. */
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/** Lazily resolved Firebase Analytics instance (browser-only, `null` if unsupported). */
export const analyticsPromise = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);

export default app;
