/**
 * Money and numeric utilities for deterministic currency arithmetic.
 * Ensures no floating-point rounding errors and category totals sum exactly to 100%.
 */

export function parseAmount(val: string | number): number {
  if (typeof val === 'number') return Math.max(0, Math.round(val));
  if (!val) return 0;
  // Handle Indian lakh/crore formats: "8L", "8 lakh", "8.5 lac", "2 crore", "₹8,00,000"
  const clean = val.toLowerCase().replace(/[,₹$\s]/g, '');
  if (clean.includes('crore') || clean.includes('cr')) {
    const num = parseFloat(clean.replace(/crore|cr/g, ''));
    return isNaN(num) ? 0 : Math.round(num * 10000000);
  }
  if (clean.includes('lakh') || clean.includes('lac') || clean.includes('l')) {
    const num = parseFloat(clean.replace(/lakh|lac|l/g, ''));
    return isNaN(num) ? 0 : Math.round(num * 100000);
  }
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : Math.max(0, Math.round(parsed));
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const rounded = Math.round(amount);
  if (currency === 'INR') {
    return '₹' + rounded.toLocaleString('en-IN');
  }
  if (currency === 'USD') {
    return '$' + rounded.toLocaleString('en-US');
  }
  return `${currency} ${rounded.toLocaleString()}`;
}

/**
 * Largest Remainder Method (Hamilton-Hare)
 * Distributes integer amounts across categories such that sum(allocated) === totalBudget.
 */
export function largestRemainderRound(
  items: { id: string; percent: number }[],
  totalBudget: number
): { id: string; amount: number }[] {
  if (items.length === 0 || totalBudget <= 0) {
    return items.map((i) => ({ id: i.id, amount: 0 }));
  }

  const totalPercent = items.reduce((sum, i) => sum + i.percent, 0) || 100;
  const rawAllocations = items.map((item) => {
    const raw = (item.percent / totalPercent) * totalBudget;
    const floor = Math.floor(raw);
    const remainder = raw - floor;
    return { id: item.id, floor, remainder };
  });

  const allocatedSum = rawAllocations.reduce((sum, a) => sum + a.floor, 0);
  let shortfall = Math.round(totalBudget) - allocatedSum;

  // Sort descending by remainder to give the +1s to highest fractional remainder
  const sorted = [...rawAllocations].sort((a, b) => b.remainder - a.remainder);

  const bonusMap = new Set<string>();
  for (let i = 0; i < shortfall && i < sorted.length; i++) {
    bonusMap.add(sorted[i].id);
  }

  return rawAllocations.map((a) => ({
    id: a.id,
    amount: a.floor + (bonusMap.has(a.id) ? 1 : 0),
  }));
}
