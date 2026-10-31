import { Task } from '../../shared/schemas.js';
import { calculateDueDate } from './timeline.js';

export function compressTimeline(tasks: Task[], eventDateStr: string, availableDays: number): Task[] {
  if (availableDays <= 0 || tasks.length === 0) {
    return tasks.map((t) => ({ ...t, dueDate: calculateDueDate(eventDateStr, 1, 0) }));
  }

  const maxLeadTime = Math.max(...tasks.map((t) => t.daysBeforeEvent), 1);
  if (availableDays >= maxLeadTime) {
    // Fits normally without compression
    return tasks.map((t) => ({
      ...t,
      dueDate: calculateDueDate(eventDateStr, t.daysBeforeEvent, t.delayedDays),
    }));
  }

  // Compress scale factor
  const factor = (availableDays - 1) / maxLeadTime;

  return tasks.map((t) => {
    const scaledDays = Math.max(1, Math.floor(t.daysBeforeEvent * factor));
    return {
      ...t,
      daysBeforeEvent: scaledDays,
      dueDate: calculateDueDate(eventDateStr, scaledDays, t.delayedDays),
    };
  });
}
