import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Firebase
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: class {
    setCustomParameters = vi.fn();
  },
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false }),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: "mock-id" }),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ empty: true, docs: [] }),
  serverTimestamp: vi.fn(),
  Timestamp: { fromDate: vi.fn() },
}));

vi.mock("firebase/analytics", () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn().mockResolvedValue(false),
  logEvent: vi.fn(),
}));

// Mock Gemini
vi.mock("@google/generative-ai", () => {
  const mockModel = {
    startChat: vi.fn().mockImplementation(() => ({
      sendMessage: vi.fn().mockResolvedValue({
        response: {
          text: () => "Mocked AI response",
        },
      }),
    })),
  };

  function MockGoogleGenerativeAI() {
    return { getGenerativeModel: vi.fn().mockReturnValue(mockModel) };
  }

  return {
    GoogleGenerativeAI: MockGoogleGenerativeAI,
    HarmCategory: {
      HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
      HARM_CATEGORY_DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT",
      HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
    },
    HarmBlockThreshold: {
      BLOCK_MEDIUM_AND_ABOVE: "BLOCK_MEDIUM_AND_ABOVE",
    },
  };
});

// Mock ResizeObserver
global.ResizeObserver = class {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
};

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock IntersectionObserver
global.IntersectionObserver = class {
  constructor(public callback: IntersectionObserverCallback, public options?: IntersectionObserverInit) {}
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  root = null;
  rootMargin = "";
  thresholds = [];
  takeRecords = vi.fn();
};

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock fetch
global.fetch = vi.fn().mockImplementation((url: string) => {
  if (url === "/api/eligibility") {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          eligible: true,
          confidence: "high",
          reasons: ["You are likely eligible to vote!"],
          nextSteps: ["Register now"],
          disclaimer: "Disclaimer text"
        }
      }),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: {} }),
  });
});
