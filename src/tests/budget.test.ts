import { describe, it, expect } from 'vitest';
import { calculateBudgetSummary } from '../domain/budget.js';

describe('Budget Domain Calculations', () => {
  it('calculates planned sum, actual sum and variance correctly', () => {
    const items = [
      { id: '1', category: 'Venue', percent: 50, planned: 5000, actual: 4800, locked: false, isContingency: false, notes: '' },
      { id: '2', category: 'Catering', percent: 50, planned: 5000, actual: 5200, locked: false, isContingency: false, notes: '' },
    ];
    const summary = calculateBudgetSummary(items, 10000);
    expect(summary.plannedSum).toBe(10000);
    expect(summary.actualSum).toBe(10000);
    expect(summary.variance).toBe(0);
    expect(summary.isOverspent).toBe(false);
  });

  it('detects overspend when actual sum exceeds total budget', () => {
    const items = [
      { id: '1', category: 'Venue', percent: 100, planned: 10000, actual: 11000, locked: false, isContingency: false, notes: '' },
    ];
    const summary = calculateBudgetSummary(items, 10000);
    expect(summary.isOverspent).toBe(true);
    expect(summary.variance).toBe(-1000);
  });
});
