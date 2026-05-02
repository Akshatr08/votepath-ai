// ─── User & Auth ────────────────────────────────────────────────────────────

/** Persistent user profile stored in Firestore under the `users` collection. */
export interface UserProfile {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  country: string;
  state: string;
  age: number;
  isFirstTimeVoter: boolean;
  preferredLanguage: "en" | "hi";
  votingMethod: "online" | "offline" | "both";
  onboardingComplete: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ─── Onboarding ─────────────────────────────────────────────────────────────

/** Data collected during the onboarding wizard flow. */
export interface OnboardingData {
  country: string;
  state: string;
  age: number;
  isFirstTimeVoter: boolean;
  votingMethod: "online" | "offline" | "both";
  preferredLanguage: "en" | "hi";
}

// ─── Eligibility ─────────────────────────────────────────────────────────────

/** Input data required for the voter eligibility check. */
export interface EligibilityInput {
  age: number;
  isCitizen: boolean;
  isResident: boolean;
  region: string;
  residencyStatus: "citizen" | "permanent_resident" | "visa_holder" | "temporary_resident" | "other";
}

/** Result returned by the eligibility checker API. */
export interface EligibilityResult {
  eligible: boolean;
  confidence: "high" | "medium" | "low";
  reasons: readonly string[];
  nextSteps: readonly string[];
  disclaimer: string;
}

// ─── Checklist ───────────────────────────────────────────────────────────────

/** Possible statuses for a checklist item. */
export type ChecklistItemStatus = "pending" | "in_progress" | "completed";

/** A single actionable item in the voter preparation checklist. */
export interface ChecklistItem {
  readonly id: string;
  title: string;
  description: string;
  status: ChecklistItemStatus;
  deadline?: string;
  notes?: string;
  category: "registration" | "documents" | "polling" | "election_day" | "general";
}

/** A user's saved checklist document stored in Firestore. */
export interface SavedChecklist {
  readonly id: string;
  readonly userId: string;
  region: string;
  items: ChecklistItem[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ─── AI Chat ─────────────────────────────────────────────────────────────────

/** A single message in the AI assistant chat. */
export interface ChatMessage {
  readonly id: string;
  role: "user" | "assistant";
  content: string;
  readonly timestamp: Date;
  isLoading?: boolean;
}

/** A chat session containing a sequence of messages. */
export interface ChatSession {
  readonly id: string;
  messages: ChatMessage[];
  readonly createdAt: Date;
}

// ─── Timeline ────────────────────────────────────────────────────────────────

/** Possible statuses for a timeline event. */
export type TimelineStatus = "upcoming" | "active" | "completed";

/** A milestone event in the election timeline. */
export interface TimelineEvent {
  readonly id: string;
  title: string;
  description: string;
  date: string;
  status: TimelineStatus;
  icon: string;
  category: "registration" | "campaign" | "voting" | "results";
}

// ─── Polling Locator ─────────────────────────────────────────────────────────

/** A physical polling location displayed on the map. */
export interface PollingLocation {
  readonly id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: "polling_booth" | "election_office" | "help_center";
  hours?: string;
  accessibilityFeatures?: readonly string[];
}

// ─── Roadmap ─────────────────────────────────────────────────────────────────

/** Possible statuses for a roadmap step. */
export type RoadmapStepStatus = "locked" | "available" | "in_progress" | "completed";

/** A step in the voter journey roadmap. */
export interface RoadmapStep {
  readonly id: string;
  step: number;
  title: string;
  description: string;
  status: RoadmapStepStatus;
  estimatedTime?: string;
  actionLabel?: string;
  actionHref?: string;
}

// ─── Accessibility ────────────────────────────────────────────────────────────

/** User-configurable accessibility preferences. */
export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  darkMode: boolean;
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

/** A frequently asked question entry. */
export interface FAQItem {
  readonly id: string;
  question: string;
  answer: string;
  category: string;
}

// ─── Myth vs Fact ────────────────────────────────────────────────────────────

/** A myth/fact pair for voter education. */
export interface MythFact {
  readonly id: string;
  myth: string;
  fact: string;
  source?: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

/** Standard API response wrapper used by all API routes. */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Request body for the `/api/chat` endpoint. */
export interface ChatApiRequest {
  message: string;
  history: { role: "user" | "model"; parts: { text: string }[] }[];
  language?: "en" | "hi";
}
