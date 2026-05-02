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

const vertexAI = new VertexAI({ project, location });

/**
 * Generates a text embedding vector using Vertex AI's `text-embedding-004` model.
 * Used for semantic similarity search in the FAQ feature.
 *
 * @param text - The input text to embed.
 * @returns A numeric vector, or an empty array on failure.
 */
export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    // @ts-expect-error - `preview` namespace exists at runtime but is not in the current VertexAI type definitions
    const embeddingModel = vertexAI.preview.getEmbeddingModel({
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

const languageClient = new LanguageServiceClient();

/**
 * Analyzes the overall sentiment of the given text using the Natural Language API.
 *
 * @param text - The text to analyze.
 * @returns The document-level sentiment object, or `null` on failure.
 */
export async function analyzeSentiment(text: string) {
  try {
    const [result] = await languageClient.analyzeSentiment({
      document: { content: text, type: "PLAIN_TEXT" },
    });
    return result.documentSentiment;
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
export async function analyzeEntities(text: string) {
  try {
    const [result] = await languageClient.analyzeEntities({
      document: { content: text, type: "PLAIN_TEXT" },
    });
    return result.entities;
  } catch (error) {
    console.error("Error analyzing entities:", error);
    return [];
  }
}

// ─── Cloud Translation API ───────────────────────────────────────────────────

const translateClient = new TranslationServiceClient();

/**
 * Translates text into the specified target language using the Cloud Translation API.
 *
 * @param text - The source text to translate.
 * @param targetLanguage - BCP-47 language code (e.g., `"hi"` for Hindi).
 * @returns The translated text, or the original text on failure.
 */
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const [response] = await translateClient.translateText({
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
