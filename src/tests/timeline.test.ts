import { describe, it, expect } from 'vitest';
import { sortTasks, isTaskOverdue } from '../domain/timeline.js';

describe('Timeline Domain Logic', () => {
  it('sorts uncompleted tasks by priority and puts completed tasks at the end', () => {
    const tasks = [
      { id: '1', title: 'Task A', dueDate: '1 month out', category: 'General', phase: 'Planning', done: true, priority: 'high' as const, daysBeforeEvent: 30, delayedDays: 0, notes: '' },
      { id: '2', title: 'Task B', dueDate: '2 months out', category: 'General', phase: 'Planning', done: false, priority: 'low' as const, daysBeforeEvent: 60, delayedDays: 0, notes: '' },
      { id: '3', title: 'Task C', dueDate: '3 months out', category: 'General', phase: 'Planning', done: false, priority: 'high' as const, daysBeforeEvent: 90, delayedDays: 0, notes: '' },
    ];
    const sorted = sortTasks(tasks);
    expect(sorted[0].id).toBe('3'); // High priority, uncompleted
    expect(sorted[1].id).toBe('2'); // Low priority, uncompleted
    expect(sorted[2].id).toBe('1'); // Completed
  });

  it('correctly identifies overdue absolute dates', () => {
    const pastDate = '2020-01-01';
    expect(isTaskOverdue(pastDate)).toBe(true);

    const futureDate = '2030-01-01';
    expect(isTaskOverdue(futureDate)).toBe(false);
  });
});
