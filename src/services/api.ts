import { EventBrief, Plan, VendorQuote } from '../../shared/schemas.js';

const TIMEOUT_MS = 25000;

async function postJson(url: string, body: any): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error?.message || `HTTP ${res.status}`);
    }
    return json.data;
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw err;
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
    clearTimeout(timer);
    const json = await res.json();
    return { plan: json.data, source: json.source || 'ai', modelUsed: json.modelUsed || 'gemini-3.8-flash' };
  } catch (err: any) {
    clearTimeout(timer);
    throw err;
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

export async function apiAskPlanner(plan: Plan, question: string, conversation: any[]): Promise<{ answer: string; model: string }> {
  return postJson('/api/ask-planner', { plan, question, conversation });
}

export async function apiCheckHealth(): Promise<{ status: string; mode: string }> {
  const res = await fetch('/api/health');
  return res.json();
}
