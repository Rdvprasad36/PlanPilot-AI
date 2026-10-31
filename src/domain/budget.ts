import { BudgetItem } from '../../shared/schemas.js';

/**
 * Calculates budget totals and variance.
 * Complexity: O(n) where n is number of budget categories.
 */
export function calculateBudgetSummary(items: BudgetItem[], totalBudget: number) {
  let plannedSum = 0;
  let actualSum = 0;

  for (const item of items) {
    plannedSum += Number(item.planned) || 0;
    actualSum += Number(item.actual) || 0;
  }

  const variance = totalBudget - actualSum;
  const isOverspent = actualSum > totalBudget;

  return {
    plannedSum,
    actualSum,
    variance,
    isOverspent,
  };
}
