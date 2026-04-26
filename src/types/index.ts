// ─── User & Auth ────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  country: string;
  state: string;
  age: number;
  isFirstTimeVoter: boolean;
  preferredLanguage: "en" | "hi";
  votingMethod: "online" | "offline" | "both";
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Onboarding ─────────────────────────────────────────────────────────────

export interface OnboardingData {
  country: string;
  state: string;
  age: number;
  isFirstTimeVoter: boolean;
  votingMethod: "online" | "offline" | "both";
  preferredLanguage: "en" | "hi";
}

// ─── Eligibility ─────────────────────────────────────────────────────────────

export interface EligibilityInput {
  age: number;
  isCitizen: boolean;
  isResident: boolean;
  region: string;
  residencyStatus: "citizen" | "permanent_resident" | "temporary_resident" | "other";
}

export interface EligibilityResult {
  eligible: boolean;
  confidence: "high" | "medium" | "low";
  reasons: string[];
  nextSteps: string[];
  disclaimer: string;
}

// ─── Checklist ───────────────────────────────────────────────────────────────

export type ChecklistItemStatus = "pending" | "in_progress" | "completed";

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: ChecklistItemStatus;
  deadline?: string;
  notes?: string;
  category: "registration" | "documents" | "polling" | "election_day" | "general";
}

export interface SavedChecklist {
  id: string;
  userId: string;
  region: string;
  items: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── AI Chat ─────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
}

// ─── Timeline ────────────────────────────────────────────────────────────────

export type TimelineStatus = "upcoming" | "active" | "completed";

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: TimelineStatus;
  icon: string;
  category: "registration" | "campaign" | "voting" | "results";
}

// ─── Polling Locator ─────────────────────────────────────────────────────────

export interface PollingLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: "polling_booth" | "election_office" | "help_center";
  hours?: string;
  accessibilityFeatures?: string[];
}

// ─── Roadmap ─────────────────────────────────────────────────────────────────

export type RoadmapStepStatus = "locked" | "available" | "in_progress" | "completed";

export interface RoadmapStep {
  id: string;
  step: number;
  title: string;
  description: string;
  status: RoadmapStepStatus;
  estimatedTime?: string;
  actionLabel?: string;
  actionHref?: string;
}

// ─── Accessibility ────────────────────────────────────────────────────────────

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  darkMode: boolean;
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// ─── Myth vs Fact ────────────────────────────────────────────────────────────

export interface MythFact {
  id: string;
  myth: string;
  fact: string;
  source?: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChatApiRequest {
  message: string;
  history: { role: "user" | "model"; parts: { text: string }[] }[];
  language?: "en" | "hi";
}
