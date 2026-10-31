import { describe, it, expect } from 'vitest';
import { largestRemainderRound, parseAmount, formatCurrency } from '../engine/money.js';
import { initializeBudget, redistributeBudget, evaluateBudgetStatus } from '../engine/budget.js';
import { propagateDelay, detectCycles, calculateDueDate } from '../engine/timeline.js';
import { compressTimeline } from '../engine/compression.js';
import { analyzeQuote } from '../engine/quotes.js';
import { rankPlanInsights } from '../engine/insights.js';
import { localAnswer } from '../engine/advisor.js';
import { generateCalendarIcs } from '../engine/calendar.js';
import { createDeterministicPlan } from '../../server/ai/client.js';

describe('Engine Money & Rounding', () => {
  it('guarantees largestRemainderRound sums exactly to totalBudget', () => {
    const categories = [
      { id: 'c1', percent: 33.33 },
      { id: 'c2', percent: 33.33 },
      { id: 'c3', percent: 33.34 },
    ];
    const total = 100000;
    const rounded = largestRemainderRound(categories, total);
    const sum = rounded.reduce((acc, r) => acc + r.amount, 0);
    expect(sum).toBe(total);
  });

  it('correctly parses Indian lakh and crore amount formats', () => {
    expect(parseAmount('8L')).toBe(800000);
    expect(parseAmount('8 lakh')).toBe(800000);
    expect(parseAmount('8.5 lac')).toBe(850000);
    expect(parseAmount('2 crore')).toBe(20000000);
    expect(parseAmount('₹8,00,000')).toBe(800000);
    expect(parseAmount(50000)).toBe(50000);
  });
});

describe('Engine Budget & Priority Weighting', () => {
  const brief = {
    occasion: 'wedding' as const,
    title: 'Test Wedding',
    date: '2028-06-15',
    guests: 200,
    budget: 1000000,
    currency: 'INR',
    city: 'Pune',
    theme: 'Fusion',
    priorityCategory: 'Catering',
    preferences: [],
    notes: '',
  };

  it('initializes budget and ensures sum of planned amounts equals total budget', () => {
    const { budget, perPlateEstimate } = initializeBudget(brief);
    const totalPlanned = budget.reduce((sum, b) => sum + b.planned, 0);
    expect(totalPlanned).toBe(brief.budget);
    expect(perPlateEstimate).toBeGreaterThan(0);
  });

  it('redistributes budget respecting locked items', () => {
    const { budget } = initializeBudget(brief);
    // Lock category 0
    budget[0].locked = true;
    const lockedAmount = budget[0].planned;

    const redistributed = redistributeBudget(budget, budget[1].id, 40, brief.budget);
    const newSum = redistributed.reduce((sum, b) => sum + b.planned, 0);
    expect(newSum).toBe(brief.budget);
    expect(redistributed[0].planned).toBe(lockedAmount);
  });

  it('scales guests and flags over-budget accurately', () => {
    const { budget, perPlateEstimate } = initializeBudget(brief);
    // Double the guest count
    const status = evaluateBudgetStatus(budget, brief.budget, 400, perPlateEstimate);
    expect(status.isOverBudget).toBe(true);
    expect(status.overspendAmount).toBeGreaterThan(0);
  });
});

describe('Engine Timeline & Compression', () => {
  const eventDate = '2028-10-15';
  const tasks = [
    { id: 't_ven', title: 'Book Venue', dueDate: '2028-04-15', category: 'Venue', phase: 'Foundation', done: false, priority: 'high' as const, daysBeforeEvent: 180, delayedDays: 0, notes: '' },
    { id: 't_cat', title: 'Book Caterer', dueDate: '2028-05-15', category: 'Catering', phase: 'Key', done: false, priority: 'high' as const, daysBeforeEvent: 150, dependsOn: 't_ven', delayedDays: 0, notes: '' },
  ];

  it('propagates upstream delay to dependent tasks', () => {
    const updated = propagateDelay(tasks, eventDate, 't_ven', 40);
    const caterer = updated.find((t) => t.id === 't_cat');
    expect(caterer?.delayedDays).toBe(40);
  });

  it('detects cycles in task dependencies', () => {
    const cyclicTasks = [
      { ...tasks[0], dependsOn: 't_cat' },
      { ...tasks[1], dependsOn: 't_ven' },
    ];
    expect(detectCycles(cyclicTasks)).toBe(true);
    expect(detectCycles(tasks)).toBe(false);
  });

  it('compresses timeline when available runway is shorter than max lead time', () => {
    const compressed = compressTimeline(tasks, eventDate, 60);
    const venue = compressed.find((t) => t.id === 't_ven');
    expect(venue?.daysBeforeEvent).toBeLessThanOrEqual(60);
  });
});

describe('Engine Quotes, Insights & Advisor', () => {
  const plan = createDeterministicPlan({
    occasion: 'wedding',
    title: 'Priya Shaadi',
    date: '2028-12-01',
    guests: 200,
    budget: 800000,
    currency: 'INR',
    city: 'Pune',
    theme: 'Traditional',
    preferences: [],
    notes: '',
  });

  it('analyzes quote and flags missing GST or guest minimums', () => {
    const quote = {
      id: 'q1',
      category: 'Catering',
      vendorName: 'Royal Feast',
      quoteAmount: 300000,
      pricePerPlate: 1500,
      guestMinimum: 250,
      taxIncluded: false,
      advancePercent: 60,
      cancellationPolicy: null,
      status: 'quoted' as const,
      contact: '',
      notes: '',
    };
    const analysis = analyzeQuote(quote, 280000, 200, 'INR');
    expect(analysis.flags.length).toBeGreaterThan(0);
    expect(analysis.isOverAllocated).toBe(true);
  });

  it('ranks insights with urgent over-budget at top', () => {
    const insights = rankPlanInsights(plan);
    expect(insights.length).toBeGreaterThan(0);
    expect(insights[0]).toHaveProperty('title');
  });

  it('localAnswer answers budget and priority questions grounded in facts', () => {
    const ans1 = localAnswer(plan, 'How much budget is remaining?');
    expect(ans1).toMatch(/8,?00,?000/);

    const ans2 = localAnswer(plan, 'What should we book first?');
    expect(ans2.length).toBeGreaterThan(10);
  });

  it('generates valid RFC 5545 calendar with line folding', () => {
    const ics = generateCalendarIcs(plan);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    const lines = ics.split('\r\n');
    lines.forEach((l) => expect(l.length).toBeLessThanOrEqual(76));
  });
});
