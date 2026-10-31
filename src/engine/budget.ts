import { BudgetItem, EventBrief } from '../../shared/schemas.js';
import { largestRemainderRound } from './money.js';
import { OCCASION_PRESETS } from './presets.js';

export function initializeBudget(brief: EventBrief): { budget: BudgetItem[]; perPlateEstimate: number } {
  const occasion = brief.occasion || brief.type || 'wedding';
  const preset = OCCASION_PRESETS[occasion] || OCCASION_PRESETS.wedding;

  let categories = preset.categories.map((c) => ({ ...c }));

  // Apply priority multiplier (1.25x) to priority category if specified
  if (brief.priorityCategory) {
    const match = categories.find(
      (c) => c.category.toLowerCase().includes(brief.priorityCategory!.toLowerCase()) && !c.isContingency
    );
    if (match) {
      match.percent *= 1.25;
      const nonContingency = categories.filter((c) => !c.isContingency);
      const totalNonCont = nonContingency.reduce((sum, c) => sum + c.percent, 0);
      nonContingency.forEach((c) => {
        c.percent = (c.percent / totalNonCont) * 90; // normalize non-contingency to 90%
      });
      const cont = categories.find((c) => c.isContingency);
      if (cont) cont.percent = 10;
    }
  }

  const rounded = largestRemainderRound(
    categories.map((c) => ({ id: c.id, percent: c.percent })),
    brief.budget
  );

  const amountMap = new Map(rounded.map((r) => [r.id, r.amount]));

  const budget: BudgetItem[] = categories.map((c) => ({
    id: c.id,
    category: c.category,
    percent: Math.round(c.percent * 10) / 10,
    planned: amountMap.get(c.id) || 0,
    actual: 0,
    locked: false,
    isContingency: Boolean(c.isContingency),
    notes: c.isContingency ? '10% safety buffer for unforeseen costs' : '',
  }));

  const catering = budget.find((b) => b.category.toLowerCase().includes('catering') || b.category.toLowerCase().includes('food'));
  const perPlateEstimate = catering && brief.guests > 0 ? Math.round(catering.planned / brief.guests) : 1200;

  return { budget, perPlateEstimate };
}

export function redistributeBudget(
  items: BudgetItem[],
  changedId: string,
  newPercent: number,
  totalBudget: number
): BudgetItem[] {
  const clampedPercent = Math.max(0, Math.min(100, newPercent));
  const changedItem = items.find((i) => i.id === changedId);
  if (!changedItem) return items;

  const lockedItems = items.filter((i) => i.locked && i.id !== changedId);
  const unlockedItems = items.filter((i) => !i.locked && i.id !== changedId);

  const lockedBudgetSum = lockedItems.reduce((sum, i) => sum + i.planned, 0);
  const availableBudget = Math.max(0, totalBudget - lockedBudgetSum);

  const changedPlanned = Math.round((clampedPercent / 100) * totalBudget);
  const budgetForOtherUnlocked = Math.max(0, availableBudget - changedPlanned);

  const otherUnlockedOrigSum = unlockedItems.reduce((sum, i) => sum + i.percent, 0) || 1;

  const roundedOther = largestRemainderRound(
    unlockedItems.map((u) => ({ id: u.id, percent: (u.percent / otherUnlockedOrigSum) * 100 })),
    budgetForOtherUnlocked
  );
  const otherMap = new Map(roundedOther.map((r) => [r.id, r.amount]));

  return items.map((item) => {
    if (item.id === changedId) {
      return { ...item, percent: clampedPercent, planned: changedPlanned };
    }
    if (item.locked) {
      return item;
    }
    const planned = otherMap.get(item.id) ?? item.planned;
    const percent = Math.round((planned / totalBudget) * 1000) / 10;
    return { ...item, percent, planned };
  });
}

export function evaluateBudgetStatus(items: BudgetItem[], totalBudget: number, guests: number, perPlateEstimate: number) {
  const actualSum = items.reduce((sum, i) => sum + (Number(i.actual) || 0), 0);
  const cateringItem = items.find((i) => i.category.toLowerCase().includes('catering') || i.category.toLowerCase().includes('food'));

  const requiredCatering = guests * perPlateEstimate;
  const plannedCatering = cateringItem ? cateringItem.planned : 0;
  const cateringDeficit = Math.max(0, requiredCatering - plannedCatering);

  const totalEffectiveCommitted = actualSum + cateringDeficit;
  const isOverBudget = cateringDeficit > 0 || actualSum > totalBudget;
  const overspendAmount = cateringDeficit > 0 ? cateringDeficit : Math.max(0, actualSum - totalBudget);

  const contingency = items.find((i) => i.isContingency);
  const contingencyRemaining = contingency ? Math.max(0, contingency.planned - contingency.actual) : 0;

  return {
    actualSum,
    cateringDeficit,
    totalEffectiveCommitted,
    isOverBudget,
    overspendAmount,
    contingencyRemaining,
    requiredCatering,
  };
}
