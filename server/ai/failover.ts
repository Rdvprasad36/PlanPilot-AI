import { GoogleGenAI } from '@google/genai';
import { config } from '../config.js';

// Priority order of Gemini models for automatic failover
const MODEL_CANDIDATES = [
  'gemini-3.8-flash',
  'gemini-2.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash-lite',
];

const modelCooldowns = new Map<string, number>();
const COOLDOWN_MS = 60 * 1000; // 1 minute cooldown on 503/429/404

export function getAvailableModels(): string[] {
  const now = Date.now();
  const available = MODEL_CANDIDATES.filter((m) => {
    const until = modelCooldowns.get(m) || 0;
    return now >= until;
  });
  // If all are in cooldown, reset and return candidates
  return available.length > 0 ? available : MODEL_CANDIDATES;
}

export function recordModelFailure(model: string, status?: number | string) {
  modelCooldowns.set(model, Date.now() + COOLDOWN_MS);
  console.warn(`[Failover] Model ${model} failed (${status || 'error'}), cooling down for 60s.`);
}

export function recordModelSuccess(model: string) {
  modelCooldowns.delete(model);
}

let genAiClient: GoogleGenAI | null = null;
export function getGoogleGenAi(): GoogleGenAI | null {
  if (genAiClient) return genAiClient;
  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  genAiClient = new GoogleGenAI({ apiKey });
  return genAiClient;
}
