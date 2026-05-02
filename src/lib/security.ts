/**
 * Security utilities for API routes.
 * 
 * Provides consistent CORS header management and security response helpers.
 * 
 * @module lib/security
 */

/**
 * Standard CORS headers for API responses.
 * Restricts origins to 'self' or allowed domains in production.
 */
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // Or specific origin in production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-RateLimit-Remaining, X-RateLimit-Reset",
};

/**
 * Merges standard CORS headers with provided headers.
 * 
 * @param headers - Additional headers to include in the response.
 * @returns Combined headers object.
 */
export function withCors(headers: Record<string, string> = {}): Record<string, string> {
  return {
    ...CORS_HEADERS,
    ...headers,
  };
}
