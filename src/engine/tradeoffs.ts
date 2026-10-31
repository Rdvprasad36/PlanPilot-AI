import { BudgetItem, EventBrief, Plan } from '../../shared/schemas.js';
import { redistributeBudget } from './budget.js';

export interface TradeoffOption {
  id: 'use_contingency' | 'trim_flexible' | 'reduce_guests';
  title: string;
  action: string;
  rupeeImpact: number;
  explanation: string;
  applicable: boolean;
}

export function generateOverBudgetOptions(
  budget: BudgetItem[],
  brief: EventBrief,
  overspendAmount: number,
  perPlateEstimate: number
): TradeoffOption[] {
  if (overspendAmount <= 0) return [];

  const contingency = budget.find((b) => b.isContingency);
  const contingencyBuffer = contingency ? contingency.planned : 0;
  const canUseContingency = contingencyBuffer >= overspendAmount;

  // Flexible categories are non-venue, non-catering, non-contingency
  const flexibleItems = budget.filter(
    (b) => !b.isContingency && !b.locked && !b.category.toLowerCase().includes('venue') && !b.category.toLowerCase().includes('catering')
  );
  const flexibleTotal = flexibleItems.reduce((sum, b) => sum + b.planned, 0);
  const canTrim = flexibleTotal >= overspendAmount;

  // Guest count reduction needed
  const guestsToReduce = perPlateEstimate > 0 ? Math.ceil(overspendAmount / perPlateEstimate) : 0;
  const targetGuests = Math.max(1, brief.guests - guestsToReduce);

  return [
    {
      id: 'use_contingency',
      title: 'Absorb with Contingency Buffer',
      action: `Deduct ${brief.currency} ${overspendAmount.toLocaleString()} from 10% contingency buffer`,
      rupeeImpact: overspendAmount,
      explanation: `Leaves ${brief.currency} ${(contingencyBuffer - overspendAmount).toLocaleString()} in reserve for day-of emergencies.`,
      applicable: canUseContingency,
    },
    {
      id: 'trim_flexible',
      title: 'Trim Flexible Categories',
      action: `Proportionately reduce Decor, Entertainment & Favors by ${brief.currency} ${overspendAmount.toLocaleString()}`,
      rupeeImpact: overspendAmount,
      explanation: 'Preserves the entire food & venue experience while balancing the total budget.',
      applicable: canTrim,
    },
    {
      id: 'reduce_guests',
      title: 'Adjust Guest Headcount',
      action: `Reduce guest count by ${guestsToReduce} (from ${brief.guests} to ${targetGuests})`,
      rupeeImpact: overspendAmount,
      explanation: `At ${brief.currency} ${perPlateEstimate.toLocaleString()} per plate, trimming ${guestsToReduce} guests eliminates the ${brief.currency} ${overspendAmount.toLocaleString()} catering deficit completely.`,
      applicable: targetGuests >= 1,
    },
  ];
}

export function applyTradeoff(plan: Plan, optionId: string, overspendAmount: number): Plan {
  const currency = plan.brief.currency;
  if (optionId === 'use_contingency') {
    const budget = plan.budget.map((b) => {
      if (b.isContingency) {
        return { ...b, actual: b.actual + overspendAmount };
      }
      return b;
    });
    return { ...plan, budget };
  }

  if (optionId === 'trim_flexible') {
    // Redistribute flexible items down
    const flexible = plan.budget.filter((b) => !b.isContingency && !b.locked && !b.category.toLowerCase().includes('catering') && !b.category.toLowerCase().includes('venue'));
    const totalFlex = flexible.reduce((sum, b) => sum + b.planned, 0) || 1;

    const budget = plan.budget.map((b) => {
      const isFlex = flexible.some((f) => f.id === b.id);
      if (isFlex) {
        const reduction = Math.round((b.planned / totalFlex) * overspendAmount);
        const newPlanned = Math.max(0, b.planned - reduction);
        const newPercent = (newPlanned / plan.brief.budget) * 100;
        return { ...b, planned: newPlanned, percent: Math.round(newPercent * 10) / 10 };
      }
      return b;
    });
    return { ...plan, budget };
  }

  if (optionId === 'reduce_guests') {
    const guestsToReduce = plan.perPlateEstimate > 0 ? Math.ceil(overspendAmount / plan.perPlateEstimate) : 0;
    const newGuests = Math.max(1, plan.brief.guests - guestsToReduce);
    return { ...plan, brief: { ...plan.brief, guests: newGuests } };
  }

  return plan;
}
