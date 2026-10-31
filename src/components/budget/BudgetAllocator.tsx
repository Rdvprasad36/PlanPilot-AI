import React from 'react';
import { usePlanStore } from '../../store/planStore.js';
import { evaluateBudgetStatus } from '../../engine/budget.js';
import { generateOverBudgetOptions } from '../../engine/tradeoffs.js';
import { formatCurrency } from '../../engine/money.js';
import { Button } from '../ui/Button';
import { Lock, Unlock, Users, AlertTriangle, ShieldCheck } from 'lucide-react';

export function BudgetAllocator() {
  const plan = usePlanStore((state) => state.plan);
  const setGuests = usePlanStore((state) => state.setGuests);
  const updateCategoryPercent = usePlanStore((state) => state.updateCategoryPercent);
  const toggleCategoryLock = usePlanStore((state) => state.toggleCategoryLock);
  const updateCategoryActual = usePlanStore((state) => state.updateCategoryActual);
  const applyTradeoffOption = usePlanStore((state) => state.applyTradeoffOption);
  const lastToast = usePlanStore((state) => state.lastChangedCategoryToast);
  const clearToast = usePlanStore((state) => state.clearToast);

  if (!plan) return null;

  const currency = plan.brief.currency;
  const status = evaluateBudgetStatus(
    plan.budget,
    plan.brief.budget,
    plan.brief.guests,
    plan.perPlateEstimate
  );

  const options = generateOverBudgetOptions(
    plan.budget,
    plan.brief,
    status.overspendAmount,
    plan.perPlateEstimate
  );

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Guest Count Driver */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Budget & Catering Driver</h2>
          <p className="text-xs text-gray-500">Guest headcount dynamically scales catering and flags budget overages</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-600">
            <Users className="h-4 w-4 text-[#5B3FD9] ml-2" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Guests:</span>
            <button
              onClick={() => setGuests(Math.max(1, plan.brief.guests - 10))}
              className="h-8 w-8 rounded-lg bg-white dark:bg-gray-600 font-bold hover:bg-gray-100 shadow-xs"
              aria-label="Decrease 10 guests"
            >
              -10
            </button>
            <span className="font-bold text-sm px-2 text-gray-900 dark:text-white">{plan.brief.guests}</span>
            <button
              onClick={() => setGuests(plan.brief.guests + 10)}
              className="h-8 w-8 rounded-lg bg-white dark:bg-gray-600 font-bold hover:bg-gray-100 shadow-xs"
              aria-label="Increase 10 guests"
            >
              +10
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500">Total Budget</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {formatCurrency(plan.brief.budget, currency)}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Fixed celebration ceiling</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500">Catering Requirement</p>
          <p className="text-xl font-bold text-[#5B3FD9] mt-1">
            {formatCurrency(status.requiredCatering, currency)}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {plan.brief.guests} guests &times; {formatCurrency(plan.perPlateEstimate, currency)}/plate
          </p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500">Committed Spending</p>
          <p className={`text-xl font-bold mt-1 ${status.isOverBudget ? 'text-[#B3261E]' : 'text-gray-900 dark:text-white'}`}>
            {formatCurrency(status.totalEffectiveCommitted, currency)}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Actual + Catering deficit</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500">Contingency Buffer</p>
          <p className="text-xl font-bold text-[#1B7F4C] mt-1">
            {formatCurrency(status.contingencyRemaining, currency)}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">10% reserve untouched</p>
        </div>
      </div>

      {/* 3. Over-Budget Options Banner */}
      {status.isOverBudget && (
        <div className="rounded-2xl bg-[#FDF3F2] dark:bg-rose-950/30 p-6 border border-[#FAD2D0] dark:border-rose-900 space-y-4" role="alert">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-[#B3261E] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-[#B3261E]">
                Over budget by {formatCurrency(status.overspendAmount, currency)}
              </h3>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                Your guest count or committed actuals exceed the total budget. Choose an option to balance the plan:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {options.map((opt) => (
              <div key={opt.id} className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-rose-200 dark:border-rose-800/50 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{opt.title}</h4>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">{opt.action}</p>
                  <p className="text-[10px] text-gray-500 mt-2">{opt.explanation}</p>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => applyTradeoffOption(opt.id, status.overspendAmount)}
                  disabled={!opt.applicable}
                  className="mt-3 w-full text-xs"
                >
                  Apply Option
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Toast */}
      {lastToast && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-xs text-[#5B3FD9] border border-indigo-200 dark:border-indigo-800">
          <span>{lastToast}</span>
          <button onClick={clearToast} className="font-bold underline ml-2">Dismiss</button>
        </div>
      )}

      {/* 4. Category Allocation Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Category Allocation (Exact Sum Guaranteed)</h3>
          <span className="text-xs text-gray-500">Lock categories to freeze them during redistribution</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b text-xs font-semibold text-gray-500 uppercase">
                <th className="py-3 px-3">Lock</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Share (%)</th>
                <th className="py-3 px-3">Planned Amount</th>
                <th className="py-3 px-3">Actual Spent</th>
                <th className="py-3 px-3">Status Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {plan.budget.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20">
                  <td className="py-3 px-3">
                    <button
                      onClick={() => toggleCategoryLock(item.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.locked ? 'bg-[#5B3FD9] text-white' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      aria-label={item.locked ? `Unlock ${item.category}` : `Lock ${item.category}`}
                    >
                      {item.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                    </button>
                  </td>
                  <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">
                    {item.category}
                    {item.isContingency && <span className="ml-2 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Buffer</span>}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={item.percent}
                        disabled={item.locked}
                        onChange={(e) => updateCategoryPercent(item.id, parseFloat(e.target.value) || 0)}
                        className="w-20 accent-[#5B3FD9] cursor-pointer"
                        aria-label={`${item.category} slider`}
                      />
                      <span className="font-mono text-xs w-10 text-gray-700 dark:text-gray-300">{item.percent}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-900 dark:text-white">
                    {formatCurrency(item.planned, currency)}
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="number"
                      min="0"
                      value={item.actual}
                      onChange={(e) => updateCategoryActual(item.id, parseFloat(e.target.value) || 0)}
                      className="w-28 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-xs font-mono"
                      aria-label={`${item.category} actual amount`}
                    />
                  </td>
                  <td className="py-3 px-3">
                    {item.actual > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B7F4C] bg-[#EAF5F0] px-2 py-0.5 rounded-full">
                        <ShieldCheck className="h-3 w-3" /> Verified Quotation
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        Estimate
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
