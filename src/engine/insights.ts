import { Plan } from '../../shared/schemas.js';
import { evaluateBudgetStatus } from './budget.js';
import { checkOverdue } from './timeline.js';

export interface PlanInsight {
  id: string;
  level: 'urgent' | 'attention' | 'suggestion' | 'good';
  title: string;
  description: string;
  targetTab: 'budget' | 'timeline' | 'vendors' | 'ideas';
  actionLabel: string;
}

export function rankPlanInsights(plan: Plan): PlanInsight[] {
  const insights: PlanInsight[] = [];
  const currency = plan.brief.currency;

  // 1. Check budget overage
  const budgetStatus = evaluateBudgetStatus(
    plan.budget,
    plan.brief.budget,
    plan.brief.guests,
    plan.perPlateEstimate
  );

  if (budgetStatus.isOverBudget) {
    insights.push({
      id: 'ins_budget_over',
      level: 'urgent',
      title: `Over budget by ${currency} ${budgetStatus.overspendAmount.toLocaleString()}`,
      description: `Driven by ${plan.brief.guests} guests scaling catering or committed actual spending. Apply mitigation tradeoffs now.`,
      targetTab: 'budget',
      actionLabel: 'Resolve Overspend',
    });
  }

  // 2. Check overdue tasks & delay ripples
  const overdueTasks = plan.timeline.filter((t) => checkOverdue(t.dueDate, t.done));
  if (overdueTasks.length > 0) {
    insights.push({
      id: 'ins_tasks_overdue',
      level: 'attention',
      title: `${overdueTasks.length} milestone${overdueTasks.length > 1 ? 's are' : ' is'} overdue`,
      description: `Action needed for: ${overdueTasks.map((t) => t.title).slice(0, 2).join(', ')}${overdueTasks.length > 2 ? '...' : ''}.`,
      targetTab: 'timeline',
      actionLabel: 'Open Timeline',
    });
  }

  const delayedTasks = plan.timeline.filter((t) => t.delayedDays > 0);
  if (delayedTasks.length > 0) {
    insights.push({
      id: 'ins_tasks_delayed',
      level: 'attention',
      title: `${delayedTasks.length} task${delayedTasks.length > 1 ? 's' : ''} pushed by upstream delays`,
      description: 'Dependent milestones have been rescheduled backwards automatically.',
      targetTab: 'timeline',
      actionLabel: 'Review Delays',
    });
  }

  // 3. Check vendor quote coverage
  const unquotedCategories = plan.budget
    .filter((b) => !b.isContingency && b.planned > 0)
    .filter((b) => !plan.vendors.some((v) => v.category.toLowerCase() === b.category.toLowerCase()));

  if (unquotedCategories.length > 0) {
    insights.push({
      id: 'ins_missing_quotes',
      level: 'suggestion',
      title: `Collect quotes for ${unquotedCategories.length} categories`,
      description: `Pending vendor quotations for ${unquotedCategories.map((c) => c.category).slice(0, 3).join(', ')}.`,
      targetTab: 'vendors',
      actionLabel: 'Add Quotes',
    });
  }

  // 4. Contingency buffer health
  const contingency = plan.budget.find((b) => b.isContingency);
  if (contingency && contingency.actual > 0) {
    const remaining = contingency.planned - contingency.actual;
    insights.push({
      id: 'ins_contingency_health',
      level: remaining < contingency.planned * 0.3 ? 'attention' : 'suggestion',
      title: `Contingency buffer at ${currency} ${remaining.toLocaleString()} remaining`,
      description: `${currency} ${contingency.actual.toLocaleString()} drawn from emergency reserves.`,
      targetTab: 'budget',
      actionLabel: 'View Buffer',
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'ins_all_good',
      level: 'good',
      title: 'Plan is on track & balanced',
      description: 'All milestones on schedule and budget allocations within target bounds.',
      targetTab: 'timeline',
      actionLabel: 'View Milestones',
    });
  }

  // Rank: urgent > attention > suggestion > good
  const rankWeight = { urgent: 4, attention: 3, suggestion: 2, good: 1 };
  return insights.sort((a, b) => rankWeight[b.level] - rankWeight[a.level]);
}
