/**
 * Google Cloud Platform service integrations.
 *
 * Provides server-side access to:
 * - **Vertex AI** — Text embeddings for semantic FAQ search
 * - **Natural Language API** — Sentiment analysis and entity extraction
 * - **Cloud Translation API** — Multi-language support
 *
 * @module lib/google-cloud
 */

import { LanguageServiceClient } from "@google-cloud/language";
import { TranslationServiceClient } from "@google-cloud/translate";
import { VertexAI } from "@google-cloud/vertexai";

/** Google Cloud project ID sourced from environment or defaulting to `"votepath-ai"`. */
const project = process.env.GOOGLE_CLOUD_PROJECT || "votepath-ai";

/** Google Cloud region for API calls. */
const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";

// ─── Vertex AI (Embeddings) ───────────────────────────────────────────────────

let _vertexAI: VertexAI | null = null;
function getVertexAI(): VertexAI {
  if (!_vertexAI) _vertexAI = new VertexAI({ project, location });
  return _vertexAI;
}

/**
 * Generates a text embedding vector using Vertex AI's `text-embedding-004` model.
 * Used for semantic similarity search in the FAQ feature.
 *
 * @param text - The input text to embed.
 * @returns A numeric vector, or an empty array on failure.
 */
interface VertexAIPreview {
  getEmbeddingModel: (opts: { model: string }) => {
    embedContent: (req: { content: { parts: Array<{ text: string }> } }) => Promise<{
      embeddings: Array<{ values: number[] }>;
    }>;
  };
}

/**
 * Generates a text embedding vector using Vertex AI's `text-embedding-004` model.
 * Used for semantic similarity search in the FAQ feature.
 *
 * @param text - The input text to embed.
 * @returns A numeric vector, or an empty array on failure.
 */
export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    const vertexAIPreview = (getVertexAI() as unknown as { preview: VertexAIPreview }).preview;
    const embeddingModel = vertexAIPreview.getEmbeddingModel({
      model: "text-embedding-004",
    });
    const result = await embeddingModel.embedContent({ content: { parts: [{ text }] } });
    return result.embeddings[0].values;
  } catch (error) {
    console.error("Error getting embeddings:", error);
    return [];
  }
}

// ─── Natural Language API (Analytics) ─────────────────────────────────────────

let _languageClient: LanguageServiceClient | null = null;
function getLanguageClient(): LanguageServiceClient {
  if (!_languageClient) _languageClient = new LanguageServiceClient();
  return _languageClient;
}

/**
 * Analyzes the overall sentiment of the given text using the Natural Language API.
 *
 * @param text - The text to analyze.
 * @returns The document-level sentiment object, or `null` on failure.
 */
export async function analyzeSentiment(text: string): Promise<{ score?: number | null; magnitude?: number | null } | null | undefined> {
  try {
    const [result] = await getLanguageClient().analyzeSentiment({
      document: { content: text, type: "PLAIN_TEXT" },
    });
    if (!result.documentSentiment) return null;
    return {
      score: result.documentSentiment.score,
      magnitude: result.documentSentiment.magnitude
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return null;
  }
}

/**
 * Extracts named entities (people, places, organizations, etc.) from the given text.
 *
 * @param text - The text to analyze.
 * @returns An array of entity objects, or an empty array on failure.
 */
export async function analyzeEntities(text: string): Promise<Array<{ name?: string | null; type?: string | null }> | null | undefined> {
  try {
    const [result] = await getLanguageClient().analyzeEntities({
      document: { content: text, type: "PLAIN_TEXT" },
    });
    return result.entities?.map(e => ({
      name: e.name,
      type: e.type ? String(e.type) : null
    }));
  } catch (error) {
    console.error("Error analyzing entities:", error);
    return [];
  }
}

// ─── Cloud Translation API ───────────────────────────────────────────────────

let _translateClient: TranslationServiceClient | null = null;
function getTranslateClient(): TranslationServiceClient {
  if (!_translateClient) _translateClient = new TranslationServiceClient();
  return _translateClient;
}

/**
 * Translates text into the specified target language using the Cloud Translation API.
 *
 * @param text - The source text to translate.
 * @param targetLanguage - BCP-47 language code (e.g., `"hi"` for Hindi).
 * @returns The translated text, or the original text on failure.
 */
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const [response] = await getTranslateClient().translateText({
      parent: `projects/${project}/locations/${location}`,
      contents: [text],
      mimeType: "text/plain",
      targetLanguageCode: targetLanguage,
    });
    return response.translations?.[0]?.translatedText || text;
  } catch (error) {
    console.error("Error translating text:", error);
    return text;
  }
}
