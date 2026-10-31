import { describe, it, expect } from 'vitest';
import { validateEventBrief } from '../domain/validators.js';

describe('Event Brief Validators', () => {
  it('rejects past dates', () => {
    const brief = {
      type: 'wedding',
      title: 'Past Event',
      date: '2020-01-01',
      guests: 100,
      budget: 10000,
      currency: 'USD',
      city: 'Boston',
      theme: 'Classic',
      preferences: [],
      notes: '',
    };
    const res = validateEventBrief(brief);
    expect(res.success).toBe(false);
    expect(res.error).toContain('future');
  });

  it('rejects guest counts over 5000', () => {
    const brief = {
      type: 'wedding',
      title: 'Huge Event',
      date: '2030-01-01',
      guests: 6000,
      budget: 10000,
      currency: 'USD',
      city: 'Boston',
      theme: 'Classic',
      preferences: [],
      notes: '',
    };
    const res = validateEventBrief(brief);
    expect(res.success).toBe(false);
  });

  it('accepts valid future brief', () => {
    const brief = {
      type: 'wedding',
      title: 'Valid Event',
      date: '2030-01-01',
      guests: 100,
      budget: 10000,
      currency: 'USD',
      city: 'Boston',
      theme: 'Classic',
      preferences: [],
      notes: '',
    };
    const res = validateEventBrief(brief);
    expect(res.success).toBe(true);
  });
});
