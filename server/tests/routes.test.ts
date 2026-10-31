import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

vi.mock('../ai/client.js', () => ({
  generateAiPlan: vi.fn().mockResolvedValue({
    plan: {
      version: 1,
      brief: { occasion: 'wedding', title: 'Test Wedding', date: '2028-01-01', guests: 100, budget: 10000, currency: 'USD', city: 'New York' },
      budget: [],
      timeline: [],
    },
    source: 'fallback',
    modelUsed: 'mocked',
  }),
}));

import { createApp } from '../app.js';

const app = createApp();

describe('Express API Routes', () => {
  it('GET /api/health returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/plan validates brief and returns plan', async () => {
    const res = await request(app)
      .post('/api/plan')
      .send({
        occasion: 'wedding',
        title: 'Test Wedding',
        date: '2028-01-01',
        guests: 100,
        budget: 10000,
        currency: 'USD',
        city: 'New York',
        theme: 'Modern',
        preferences: [],
      });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('budget');
    expect(res.body.data).toHaveProperty('timeline');
  });

  it('POST /api/plan rejects past date with 400', async () => {
    const res = await request(app)
      .post('/api/plan')
      .send({
        occasion: 'wedding',
        title: 'Past Wedding',
        date: '2020-01-01',
        guests: 100,
        budget: 10000,
        currency: 'USD',
        city: 'New York',
        theme: 'Modern',
        preferences: [],
      });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
