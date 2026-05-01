import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted to ensure mock objects are available before vi.mock
const mocks = vi.hoisted(() => ({
  mockLanguageClient: {
    analyzeSentiment: vi.fn(),
    analyzeEntities: vi.fn(),
  },
  mockTranslateClient: {
    translateText: vi.fn(),
  },
  mockEmbeddingModel: {
    embedContent: vi.fn(),
  },
  mockVertexAI: {
    getGenerativeModel: vi.fn(),
    preview: {
      getEmbeddingModel: vi.fn(),
    },
  },
}));

// Set up the internal mock for the embedding model
mocks.mockVertexAI.preview.getEmbeddingModel.mockReturnValue(mocks.mockEmbeddingModel);

vi.mock("@google-cloud/language", () => ({
  LanguageServiceClient: vi.fn(function() { return mocks.mockLanguageClient; }),
}));

vi.mock("@google-cloud/translate", () => ({
  TranslationServiceClient: vi.fn(function() { return mocks.mockTranslateClient; }),
}));

vi.mock("@google-cloud/vertexai", () => ({
  VertexAI: vi.fn(function() { return mocks.mockVertexAI; }),
}));

import { analyzeSentiment, translateText, getEmbeddings, analyzeEntities } from "@/lib/google-cloud";

describe("Google Cloud Integrations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-setup the internal mock after clear
    mocks.mockVertexAI.preview.getEmbeddingModel.mockReturnValue(mocks.mockEmbeddingModel);
  });

  it("should analyze sentiment correctly", async () => {
    mocks.mockLanguageClient.analyzeSentiment.mockResolvedValue([{ documentSentiment: { score: 0.8 } }]);
    const sentiment = await analyzeSentiment("I love voting!");
    expect(sentiment?.score).toBe(0.8);
  });

  it("should translate text correctly", async () => {
    mocks.mockTranslateClient.translateText.mockResolvedValue([{ translations: [{ translatedText: "नमस्ते" }] }]);
    const translation = await translateText("Hello", "hi");
    expect(translation).toBe("नमस्ते");
  });

  it("should get embeddings correctly", async () => {
    mocks.mockEmbeddingModel.embedContent.mockResolvedValue({ embeddings: [{ values: [0.1, 0.2, 0.3] }] });
    const embeddings = await getEmbeddings("How do I vote?");
    expect(embeddings).toEqual([0.1, 0.2, 0.3]);
  });

  it("should analyze entities correctly", async () => {
    mocks.mockLanguageClient.analyzeEntities.mockResolvedValue([{ entities: [{ name: "Election" }] }]);
    const entities = await analyzeEntities("Election in India");
    expect(entities).toBeDefined();
  });

  describe("Error Handling", () => {
    it("should handle sentiment analysis errors", async () => {
      mocks.mockLanguageClient.analyzeSentiment.mockRejectedValue(new Error("API Error"));
      const result = await analyzeSentiment("error");
      expect(result).toBeNull();
    });

    it("should handle translation errors", async () => {
      mocks.mockTranslateClient.translateText.mockRejectedValue(new Error("API Error"));
      const result = await translateText("error", "hi");
      expect(result).toBe("error");
    });

    it("should handle entity analysis errors", async () => {
      mocks.mockLanguageClient.analyzeEntities.mockRejectedValue(new Error("API Error"));
      const result = await analyzeEntities("error");
      expect(result).toEqual([]);
    });

    it("should handle embedding errors", async () => {
      mocks.mockVertexAI.preview.getEmbeddingModel.mockImplementationOnce(() => {
        throw new Error("Mock Error");
      });
      const result = await getEmbeddings("error");
      expect(result).toEqual([]);
    });
  });
});
