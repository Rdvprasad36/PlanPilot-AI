import { Task } from '../../shared/schemas.js';

/**
 * Sorts tasks by due date urgency and priority.
 * Complexity: O(n log n) due to sorting.
 */
export function sortTasks(tasks: Task[]): Task[] {
  const priorityWeight = { high: 3, med: 2, low: 1 };
  return [...tasks].sort((a, b) => {
    if (a.done !== b.done) {
      return a.done ? 1 : -1; // Uncompleted first
    }
    const pDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (pDiff !== 0) return pDiff;
    return a.title.localeCompare(b.title);
  });
}

export function isTaskOverdue(dueDateStr: string): boolean {
  // If due date is absolute ISO date string and past today
  const date = Date.parse(dueDateStr);
  if (!isNaN(date)) {
    return date < Date.now();
  }
  return false;
}
