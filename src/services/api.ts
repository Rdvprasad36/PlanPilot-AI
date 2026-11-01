import { EventBrief, Plan, VendorQuote, planSchema } from '../../shared/schemas.js';

const TIMEOUT_MS = 25000;

interface ApiErrorResponse {
  error?: {
    message?: unknown;
  };
}

interface ApiResponse<T> {
  data: T;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function readJson<T>(res: Response): Promise<T> {
  const body: unknown = await res.json();
  if (!res.ok) {
    const error = isRecord(body) ? (body as ApiErrorResponse).error : undefined;
    const message = isRecord(error) && typeof error.message === 'string' ? error.message : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return body as T;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const json = await readJson<ApiResponse<T>>(res);
    return json.data;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function apiGeneratePlan(brief: EventBrief): Promise<{ plan: Plan; source: string; modelUsed: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brief),
      signal: controller.signal,
    });
    const json = await readJson<ApiResponse<Plan> & { source?: string; modelUsed?: string }>(res);
    return {
      plan: planSchema.parse(json.data),
      source: json.source || 'ai',
      modelUsed: json.modelUsed || 'gemini-3.8-flash',
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function apiParseIntake(description: string): Promise<Partial<EventBrief>> {
  return postJson('/api/parse-intake', { description });
}

export async function apiExtractQuote(category: string, quoteText: string): Promise<Partial<VendorQuote>> {
  return postJson('/api/extract-quote', { category, quoteText });
}

export async function apiReviewPlan(plan: Plan): Promise<{ summary: string; nextSteps: string[]; model: string }> {
  return postJson('/api/review-plan', plan);
}

export async function apiAskPlanner(plan: Plan, question: string, conversation: ChatMessage[]): Promise<{ answer: string; model: string }> {
  return postJson('/api/ask-planner', { plan, question, conversation });
}

export async function apiCheckHealth(): Promise<{ status: string; mode: string }> {
  const res = await fetch('/api/health');
  return readJson<{ status: string; mode: string }>(res);
}
