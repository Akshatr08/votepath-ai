import { LanguageServiceClient } from "@google-cloud/language";
import { TranslationServiceClient } from "@google-cloud/translate";
import { VertexAI } from "@google-cloud/vertexai";

// Initialize Google Cloud clients
const project = process.env.GOOGLE_CLOUD_PROJECT || "votepath-ai";
const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";

// ─── Vertex AI (Embeddings) ───────────────────────────────────────────────────

const vertexAI = new VertexAI({ project, location });
const generativeModel = vertexAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function getEmbeddings(text: string): Promise<number[]> {
  try {
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

export async function translateText(text: string, targetLanguage: string) {
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
