import { create } from 'zustand';
import { Plan, EventBrief, BudgetItem, Task, VendorQuote } from '../../shared/schemas.js';
import { apiGeneratePlan, apiReviewPlan, apiAskPlanner } from '../services/api.js';
import { savePlanToStorage, loadPlanFromStorage, clearPlanStorage } from '../services/storage.js';
import { redistributeBudget, evaluateBudgetStatus } from '../engine/budget.js';
import { propagateDelay } from '../engine/timeline.js';
import { applyTradeoff } from '../engine/tradeoffs.js';
import { localAnswer } from '../engine/advisor.js';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  model?: string;
  timestamp: string;
}

interface PlanState {
  plan: Plan | null;
  loading: boolean;
  thinkingSeconds: number;
  error: string | null;
  chatMessages: Message[];
  aiReview: { summary: string; nextSteps: string[]; model: string } | null;
  lastChangedCategoryToast: string | null;

  initPlan: (brief: EventBrief) => Promise<void>;
  loadSaved: () => boolean;
  clear: () => void;
  setGuests: (count: number) => void;
  updateCategoryPercent: (id: string, newPercent: number) => void;
  toggleCategoryLock: (id: string) => void;
  updateCategoryActual: (id: string, actual: number) => void;
  applyTradeoffOption: (optionId: string, overspendAmount: number) => void;
  setTaskDelay: (taskId: string, days: number) => void;
  toggleTaskDone: (taskId: string) => void;
  addVendorQuote: (quote: VendorQuote) => void;
  deleteVendor: (id: string) => void;
  togglePinIdea: (id: string) => void;
  dismissIdea: (id: string) => void;
  fetchAiReview: () => Promise<void>;
  sendChatMessage: (question: string) => Promise<void>;
  clearToast: () => void;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plan: null,
  loading: false,
  thinkingSeconds: 0,
  error: null,
  chatMessages: [],
  aiReview: null,
  lastChangedCategoryToast: null,

  clearToast: () => set({ lastChangedCategoryToast: null }),

  loadSaved: () => {
    const saved = loadPlanFromStorage();
    if (saved) {
      set({ plan: saved });
      return true;
    }
    return false;
  },

  clear: () => {
    clearPlanStorage();
    set({ plan: null, aiReview: null, chatMessages: [], error: null });
  },

  initPlan: async (brief: EventBrief) => {
    set({ loading: true, error: null, thinkingSeconds: 0 });
    const timer = setInterval(() => {
      set((s) => ({ thinkingSeconds: s.thinkingSeconds + 1 }));
    }, 1000);

    try {
      const { plan } = await apiGeneratePlan(brief);
      clearInterval(timer);
      savePlanToStorage(plan);
      set({ plan, loading: false, thinkingSeconds: 0 });
    } catch (err: unknown) {
      clearInterval(timer);
      const message = err instanceof Error ? err.message : 'Failed to generate plan';
      set({ error: message, loading: false, thinkingSeconds: 0 });
    }
  },

  setGuests: (count: number) => {
    const { plan } = get();
    if (!plan || count <= 0) return;
    const updatedPlan: Plan = {
      ...plan,
      brief: { ...plan.brief, guests: count },
    };
    savePlanToStorage(updatedPlan);
    set({ plan: updatedPlan });
  },

  updateCategoryPercent: (id: string, newPercent: number) => {
    const { plan } = get();
    if (!plan) return;
    const item = plan.budget.find((b) => b.id === id);
    const diff = item ? Math.round(newPercent - item.percent) : 0;
    const newBudget = redistributeBudget(plan.budget, id, newPercent, plan.brief.budget);
    const updatedPlan: Plan = { ...plan, budget: newBudget };
    savePlanToStorage(updatedPlan);
    set({
      plan: updatedPlan,
      lastChangedCategoryToast: item ? `${item.category}: ${diff > 0 ? '+' : ''}${diff}% (reallocated across unlocked categories)` : null,
    });
  },

  toggleCategoryLock: (id: string) => {
    const { plan } = get();
    if (!plan) return;
    const budget = plan.budget.map((b) => (b.id === id ? { ...b, locked: !b.locked } : b));
    const updatedPlan = { ...plan, budget };
    savePlanToStorage(updatedPlan);
    set({ plan: updatedPlan });
  },

  updateCategoryActual: (id: string, actual: number) => {
    const { plan } = get();
    if (!plan) return;
    const budget = plan.budget.map((b) => (b.id === id ? { ...b, actual } : b));
    const updatedPlan = { ...plan, budget };
    savePlanToStorage(updatedPlan);
    set({ plan: updatedPlan });
  },

  applyTradeoffOption: (optionId: string, overspendAmount: number) => {
    const { plan } = get();
    if (!plan) return;
    const updatedPlan = applyTradeoff(plan, optionId, overspendAmount);
    savePlanToStorage(updatedPlan);
    set({ plan: updatedPlan });
  },

  setTaskDelay: (taskId: string, days: number) => {
    const { plan } = get();
    if (!plan) return;
    const newTimeline = propagateDelay(plan.timeline, plan.brief.date, taskId, days);
    const updatedPlan = { ...plan, timeline: newTimeline };
    savePlanToStorage(updatedPlan);
    set({ plan: updatedPlan });
  },

  toggleTaskDone: (taskId: string) => {
    const { plan } = get();
    if (!plan) return;
    const timeline = plan.timeline.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
    const updatedPlan = { ...plan, timeline };
    savePlanToStorage(updatedPlan);
    set({ plan: updatedPlan });
  },

  addVendorQuote: (quote: VendorQuote) => {
    const { plan } = get();
    if (!plan) return;
    const vendors = [quote, ...plan.vendors];
    const updatedPlan = { ...plan, vendors };
    savePlanToStorage(updatedPlan);
    set({ plan: updatedPlan });
  },

  deleteVendor: (id: string) => {
    const { plan } = get();
    if (!plan) return;
    const vendors = plan.vendors.filter((v) => v.id !== id);
    const updatedPlan = { ...plan, vendors };
    savePlanToStorage(updatedPlan);
    set({ plan: updatedPlan });
  },

  togglePinIdea: (id: string) => {
    const { plan } = get();
    if (!plan) return;
    const ideas = plan.ideas.map((i) => (i.id === id ? { ...i, pinned: !i.pinned } : i));
    const updatedPlan = { ...plan, ideas };
    savePlanToStorage(updatedPlan);
    set({ plan: updatedPlan });
  },

  dismissIdea: (id: string) => {
    const { plan } = get();
    if (!plan) return;
    const ideas = plan.ideas.map((i) => (i.id === id ? { ...i, dismissed: true } : i));
    const updatedPlan = { ...plan, ideas };
    savePlanToStorage(updatedPlan);
    set({ plan: updatedPlan });
  },

  fetchAiReview: async () => {
    const { plan } = get();
    if (!plan) return;
    set({ loading: true });
    try {
      const review = await apiReviewPlan(plan);
      set({ aiReview: review, loading: false });
    } catch (err: unknown) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Unable to load the AI plan review.',
      });
    }
  },

  sendChatMessage: async (question: string) => {
    const { plan, chatMessages } = get();
    if (!plan || !question.trim()) return;

    const userMsg: Message = {
      role: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    set({ chatMessages: [...chatMessages, userMsg], loading: true });

    try {
      const res = await apiAskPlanner(plan, question, chatMessages);
      const assistantMsg: Message = {
        role: 'assistant',
        text: res.answer,
        model: res.model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      set((s) => ({ chatMessages: [...s.chatMessages, assistantMsg], loading: false }));
    } catch {
      const fallbackText = localAnswer(plan, question);
      const assistantMsg: Message = {
        role: 'assistant',
        text: fallbackText,
        model: 'built-in planner',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      set((s) => ({ chatMessages: [...s.chatMessages, assistantMsg], loading: false }));
    }
  },
}));
