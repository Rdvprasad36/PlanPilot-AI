import { planSchema, Plan } from '../../shared/schemas.js';

const STORAGE_KEY = 'planpilot_ai_current_plan_v1';

export function savePlanToStorage(plan: Plan): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch (err) {
    console.error('Failed to save plan to localStorage:', err);
  }
}

export function loadPlanFromStorage(): Plan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const result = planSchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    }
    console.warn('Corrupted plan data in localStorage discarded.');
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch (err) {
    console.error('Failed to load plan from storage:', err);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearPlanStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}
