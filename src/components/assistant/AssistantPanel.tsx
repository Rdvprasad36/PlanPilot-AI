import React, { useState } from 'react';
import { usePlanStore } from '../../store/planStore.js';
import { rankPlanInsights } from '../../engine/insights.js';
import { Button } from '../ui/Button';
import { Sparkles, Bot, AlertTriangle, CheckCircle2, Clock, Send, MessageSquare } from 'lucide-react';

interface AssistantPanelProps {
  onNavigateTab: (tab: 'budget' | 'timeline' | 'vendors' | 'ideas') => void;
}

export function AssistantPanel({ onNavigateTab }: AssistantPanelProps) {
  const plan = usePlanStore((state) => state.plan);
  const loading = usePlanStore((state) => state.loading);
  const thinkingSeconds = usePlanStore((state) => state.thinkingSeconds);
  const aiReview = usePlanStore((state) => state.aiReview);
  const fetchAiReview = usePlanStore((state) => state.fetchAiReview);
  const chatMessages = usePlanStore((state) => state.chatMessages);
  const sendChatMessage = usePlanStore((state) => state.sendChatMessage);

  const [inputQuestion, setInputQuestion] = useState('');

  if (!plan) return null;

  const insights = rankPlanInsights(plan);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || loading) return;
    const q = inputQuestion;
    setInputQuestion('');
    await sendChatMessage(q);
  };

  const sampleQuestions = [
    'How much budget is remaining?',
    'What should we book first?',
    'How do I negotiate with the caterer?',
  ];

  return (
    <div className="space-y-6">
      {/* 1. Ranked Insights (Deterministic & Instant) */}
      <section className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B3FD9]/10 text-[#5B3FD9]">
              <Clock className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">What Needs Attention Now</h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchAiReview}
            disabled={loading}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1 text-[#5B3FD9]" />
            Ask AI for Plan Review
          </Button>
        </div>

        <div className="space-y-3">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className={`flex items-start justify-between p-4 rounded-xl border transition-all ${
                ins.level === 'urgent'
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                  : ins.level === 'attention'
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
                  : 'bg-gray-50/70 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                {ins.level === 'urgent' ? (
                  <AlertTriangle className="h-5 w-5 text-[#B3261E] shrink-0 mt-0.5" />
                ) : ins.level === 'attention' ? (
                  <Clock className="h-5 w-5 text-[#8A5A00] shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-[#1B7F4C] shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      {ins.level}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{ins.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{ins.description}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateTab(ins.targetTab)}
                className="shrink-0 text-xs py-1"
              >
                {ins.actionLabel} &rarr;
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. AI Plan Review Card */}
      {aiReview && (
        <section className="rounded-2xl bg-gradient-to-br from-[#5B3FD9]/5 to-indigo-50/50 dark:from-[#5B3FD9]/15 dark:to-gray-800 p-6 border border-[#5B3FD9]/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#5B3FD9] text-white">
              <Sparkles className="h-3 w-3" /> AI Plan Review
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Answered by {aiReview.model}
            </span>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{aiReview.summary}</p>
          <div className="space-y-1.5 pt-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Prioritised Next Steps:</p>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {aiReview.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5B3FD9]" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 3. Interactive Family Assistant Chat */}
      <section className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B3FD9] text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Ask PlanPilot AI Assistant</h2>
            <p className="text-xs text-gray-500">Ask questions grounded directly in your verified plan numbers</p>
          </div>
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendChatMessage(q)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat History */}
        {chatMessages.length > 0 && (
          <div className="space-y-3 max-h-72 overflow-y-auto p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-[#5B3FD9] text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  {msg.model && <span>&bull; Answered by {msg.model}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Thinking Timer */}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#5B3FD9] font-medium animate-pulse">
            <Sparkles className="h-4 w-4 animate-spin" />
            Gemini is thinking... ({thinkingSeconds}s)
          </div>
        )}

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask about budget, vendor negotiations, or deadlines..."
            className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B3FD9]"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !inputQuestion.trim()} variant="primary">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </section>
    </div>
  );
}
