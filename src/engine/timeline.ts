import { Task } from '../../shared/schemas.js';

export function calculateDueDate(eventDateStr: string, daysBeforeEvent: number, delayedDays: number = 0): string {
  const eventDate = new Date(eventDateStr);
  if (isNaN(eventDate.getTime())) return 'TBD';
  const effectiveDays = Math.max(0, daysBeforeEvent - delayedDays);
  const targetDate = new Date(eventDate.getTime() - effectiveDays * 24 * 60 * 60 * 1000);
  return targetDate.toISOString().split('T')[0];
}

export function detectCycles(tasks: Task[]): boolean {
  const adj = new Map<string, string[]>();
  tasks.forEach((t) => {
    if (t.dependsOn) {
      const list = adj.get(t.dependsOn) || [];
      list.push(t.id);
      adj.set(t.dependsOn, list);
    }
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();

  function dfs(curr: string): boolean {
    visited.add(curr);
    recStack.add(curr);
    for (const neighbor of adj.get(curr) || []) {
      if (!visited.has(neighbor) && dfs(neighbor)) return true;
      if (recStack.has(neighbor)) return true;
    }
    recStack.delete(curr);
    return false;
  }

  for (const t of tasks) {
    if (!visited.has(t.id)) {
      if (dfs(t.id)) return true;
    }
  }
  return false;
}

export function propagateDelay(tasks: Task[], eventDate: string, sourceTaskId: string, additionalDelayDays: number): Task[] {
  const taskMap = new Map(tasks.map((t) => [t.id, { ...t }]));
  const source = taskMap.get(sourceTaskId);
  if (!source) return tasks;

  source.delayedDays += additionalDelayDays;

  // BFS propagate to all direct & indirect dependents
  const queue = [sourceTaskId];
  while (queue.length > 0) {
    const parentId = queue.shift()!;
    const parent = taskMap.get(parentId)!;

    for (const task of taskMap.values()) {
      if (task.dependsOn === parentId) {
        task.delayedDays = Math.max(task.delayedDays, parent.delayedDays);
        queue.push(task.id);
      }
    }
  }

  return Array.from(taskMap.values()).map((t) => ({
    ...t,
    dueDate: calculateDueDate(eventDate, t.daysBeforeEvent, t.delayedDays),
  }));
}

export function checkOverdue(dueDateStr: string, done: boolean): boolean {
  if (done) return false;
  const target = Date.parse(dueDateStr);
  if (isNaN(target)) return false;
  return target < Date.now();
}
