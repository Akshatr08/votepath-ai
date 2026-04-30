import { describe, it, expect, vi } from "vitest";

// Mock the Google Cloud SDKs with proper constructor functions
vi.mock("@google-cloud/language", () => {
  function MockLanguageServiceClient() {
    return {
      analyzeSentiment: vi.fn().mockResolvedValue([{ documentSentiment: { score: 0.8 } }]),
      analyzeEntities: vi.fn().mockResolvedValue([{ entities: [{ name: "Election" }] }]),
    };
  }
  return { LanguageServiceClient: MockLanguageServiceClient };
});

vi.mock("@google-cloud/translate", () => {
  function MockTranslationServiceClient() {
    return {
      translateText: vi.fn().mockResolvedValue([{ translations: [{ translatedText: "नमस्ते" }] }]),
    };
  }
  return { TranslationServiceClient: MockTranslationServiceClient };
});

vi.mock("@google-cloud/vertexai", () => {
  function MockVertexAI() {
    return {
      getGenerativeModel: vi.fn(),
      preview: {
        getEmbeddingModel: vi.fn().mockImplementation(() => ({
          embedContent: vi.fn().mockResolvedValue({ embeddings: [{ values: [0.1, 0.2, 0.3] }] }),
        })),
      },
    };
  }
  return { VertexAI: MockVertexAI };
});

import { analyzeSentiment, translateText, getEmbeddings, analyzeEntities } from "@/lib/google-cloud";

describe("Google Cloud Integrations", () => {
  it("should analyze sentiment correctly", async () => {
    const sentiment = await analyzeSentiment("I love voting!");
    expect(sentiment?.score).toBe(0.8);
  });

  it("should translate text correctly", async () => {
    const translation = await translateText("Hello", "hi");
    expect(translation).toBe("नमस्ते");
  });

  it("should get embeddings correctly", async () => {
    const embeddings = await getEmbeddings("How do I vote?");
    expect(embeddings).toEqual([0.1, 0.2, 0.3]);
  });

  it("should analyze entities correctly", async () => {
    const entities = await analyzeEntities("Election in India");
    expect(entities).toBeDefined();
    expect(Array.isArray(entities)).toBe(true);
  });
});
