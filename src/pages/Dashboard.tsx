import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanStore } from '../store/planStore.js';
import { AssistantPanel } from '../components/assistant/AssistantPanel';
import { BudgetAllocator } from '../components/budget/BudgetAllocator';
import { TimelineView } from '../components/timeline/TimelineView';
import { VendorList } from '../components/vendors/VendorList';
import { IdeaGrid } from '../components/ideas/IdeaGrid';
import { Button } from '../components/ui/Button';
import { Sparkles, Bot, DollarSign, Calendar, Building2, Lightbulb, Printer, Settings, Plus } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const plan = usePlanStore((state) => state.plan);
  const loadSaved = usePlanStore((state) => state.loadSaved);
  const clear = usePlanStore((state) => state.clear);

  const [activeTab, setActiveTab] = useState<'assistant' | 'budget' | 'timeline' | 'vendors' | 'ideas'>('assistant');

  useEffect(() => {
    if (!plan) {
      const loaded = loadSaved();
      if (!loaded) navigate('/wizard');
    }
  }, [plan, loadSaved, navigate]);

  if (!plan) return null;

  const tabs = [
    { id: 'assistant', label: 'Overview & Assistant', icon: Bot },
    { id: 'budget', label: 'Budget & Tradeoffs', icon: DollarSign },
    { id: 'timeline', label: 'Timeline & Runsheet', icon: Calendar },
    { id: 'vendors', label: 'Vendors & Quotes', icon: Building2 },
    { id: 'ideas', label: 'Personalized Ideas', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5FF] dark:bg-gray-900 text-[#1B1B1F] dark:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-6 py-4 sticky top-0 z-40 shadow-xs">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B3FD9] text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base text-gray-900 dark:text-white">{plan.brief.title}</h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-[#5B3FD9]">
                  {plan.brief.occasion || plan.brief.type}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {plan.brief.city} &bull; {plan.brief.date} &bull; {plan.brief.guests} guests &bull;{' '}
                <span className="font-semibold text-[#5B3FD9]">
                  {plan.source === 'ai' ? `Gemini AI (${plan.modelUsed})` : 'Deterministic Engine'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/print')} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-1" /> Print Summary
            </Button>
            <Button onClick={() => navigate('/settings')} variant="ghost" size="sm" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                clear();
                navigate('/wizard');
              }}
              variant="secondary"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" /> New Plan
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-6 shadow-xs overflow-x-auto" aria-label="Planning Tabs">
        <div className="mx-auto max-w-7xl flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  isSel
                    ? 'border-[#5B3FD9] text-[#5B3FD9]'
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content View */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {activeTab === 'assistant' && <AssistantPanel onNavigateTab={(tab) => setActiveTab(tab)} />}
        {activeTab === 'budget' && <BudgetAllocator />}
        {activeTab === 'timeline' && <TimelineView />}
        {activeTab === 'vendors' && <VendorList />}
        {activeTab === 'ideas' && <IdeaGrid />}
      </main>
    </div>
  );
}
