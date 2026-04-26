import { describe, it, expect, vi } from "vitest";

// Mock the Google Cloud SDKs
vi.mock("@google-cloud/language", () => ({
  LanguageServiceClient: vi.fn().mockImplementation(() => ({
    analyzeSentiment: vi.fn().mockResolvedValue([{ documentSentiment: { score: 0.8 } }]),
    analyzeEntities: vi.fn().mockResolvedValue([{ entities: [{ name: "Election" }] }]),
  })),
}));

vi.mock("@google-cloud/translate", () => ({
  TranslationServiceClient: vi.fn().mockImplementation(() => ({
    translateText: vi.fn().mockResolvedValue([{ translations: [{ translatedText: "नमस्ते" }] }]),
  })),
}));

vi.mock("@google-cloud/vertexai", () => ({
  VertexAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn(),
    preview: {
      getEmbeddingModel: vi.fn().mockImplementation(() => ({
        embedContent: vi.fn().mockResolvedValue({ embeddings: [{ values: [0.1, 0.2, 0.3] }] }),
      })),
    },
  })),
}));

import { analyzeSentiment, translateText, getEmbeddings } from "@/lib/google-cloud";

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
});
