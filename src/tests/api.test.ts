import { describe, expect, it, vi, afterEach } from 'vitest';
import { apiGeneratePlan } from '../services/api.js';

afterEach(() => {
  vi.restoreAllMocks();
});

const validPlan = {
  version: 1,
  brief: {
    occasion: 'wedding' as const,
    title: 'Test Wedding',
    date: '2030-01-01',
    guests: 100,
    budget: 10000,
    currency: 'USD',
    city: 'New York',
    theme: 'Modern',
    preferences: [],
    notes: '',
  },
  budget: [],
  timeline: [],
  runsheet: [],
  vendors: [],
  ideas: [],
  perPlateEstimate: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  source: 'fallback' as const,
  modelUsed: 'deterministic-engine',
};

describe('API client error handling', () => {
  it('surfaces server errors instead of treating them as successful responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: { message: 'Invalid plan' } }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    await expect(apiGeneratePlan(validPlan.brief)).rejects.toThrow('Invalid plan');
  });

  it('validates generated plans before returning them to the app', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: validPlan, source: 'fallback', modelUsed: 'deterministic-engine' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    await expect(apiGeneratePlan(validPlan.brief)).resolves.toMatchObject({ plan: validPlan });
  });
});
