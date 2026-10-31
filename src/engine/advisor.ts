import { Plan } from '../../shared/schemas.js';
import { evaluateBudgetStatus } from './budget.js';

export function extractPlanFacts(plan: Plan) {
  const currency = plan.brief.currency;
  const status = evaluateBudgetStatus(
    plan.budget,
    plan.brief.budget,
    plan.brief.guests,
    plan.perPlateEstimate
  );

  const pendingTasks = plan.timeline.filter((t) => !t.done);
  const nextUrgentTasks = pendingTasks
    .filter((t) => t.priority === 'high')
    .slice(0, 3)
    .map((t) => t.title);

  return {
    title: plan.brief.title,
    occasion: plan.brief.occasion || plan.brief.type,
    date: plan.brief.date,
    guests: plan.brief.guests,
    totalBudget: `${currency} ${plan.brief.budget.toLocaleString()}`,
    actualSpent: `${currency} ${status.actualSum.toLocaleString()}`,
    isOverBudget: status.isOverBudget,
    overspendAmount: `${currency} ${status.overspendAmount.toLocaleString()}`,
    remainingBudget: `${currency} ${Math.max(0, plan.brief.budget - status.actualSum).toLocaleString()}`,
    contingencyRemaining: `${currency} ${status.contingencyRemaining.toLocaleString()}`,
    nextTasks: nextUrgentTasks.join(', ') || 'No urgent pending milestones',
    totalTasks: plan.timeline.length,
    completedTasks: plan.timeline.filter((t) => t.done).length,
    vendorsBooked: plan.vendors.filter((v) => v.status === 'booked' || v.status === 'paid').length,
  };
}

export function localAnswer(plan: Plan, query: string): string {
  const q = query.toLowerCase();
  const facts = extractPlanFacts(plan);
  const currency = plan.brief.currency;

  if (q.includes('budget') || q.includes('remaining') || q.includes('left') || q.includes('cost') || q.includes('spend')) {
    if (facts.isOverBudget) {
      return `Your plan is currently over budget by ${facts.overspendAmount}. The total budget ceiling is ${facts.totalBudget}, and committed allocations exceed this limit. You can balance the plan using the Tradeoffs panel by adjusting guest headcount or trimming flexible categories.`;
    }
    return `Your total budget is ${facts.totalBudget}. Currently, ${facts.actualSpent} has been committed, leaving approximately ${facts.remainingBudget} available (including ${facts.contingencyRemaining} in your emergency contingency buffer).`;
  }

  if (q.includes('book first') || q.includes('first') || q.includes('next') || q.includes('priority') || q.includes('start')) {
    return `Lock in these top-priority milestones first: ${facts.nextTasks}. Securing the venue and primary catering locks the dates and keeps downstream vendor timelines on schedule.`;
  }

  if (q.includes('cater') || q.includes('food') || q.includes('negotiate') || q.includes('quote')) {
    return `When finalizing caterers, request clear breakdown per person, review minimum plate guarantees, and verify that taxes/service fees are itemized before signing contracts.`;
  }

  if (q.includes('status') || q.includes('summary') || q.includes('review') || q.includes('overview')) {
    return `${facts.title} update: ${facts.completedTasks}/${facts.totalTasks} milestones completed, ${facts.vendorsBooked} vendors booked. Budget status: ${facts.isOverBudget ? `Over budget by ${facts.overspendAmount}` : 'Well within limits'}.`;
  }

  return `Based on your plan for ${facts.title}: Total budget is ${facts.totalBudget} for ${facts.guests} guests on ${facts.date}. Next priority: ${facts.nextTasks}.`;
}
