import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanStore } from '../store/planStore.js';
import { Button } from '../components/ui/Button';
import { Sparkles, Heart, Gift, Users, Trophy, ShieldCheck, Zap, ArrowRight, Check } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const initPlan = usePlanStore((state) => state.initPlan);

  const handleQuickDemo = async () => {
    await initPlan({
      occasion: 'wedding',
      title: 'Emma & David Wedding',
      date: '2028-06-20',
      guests: 180,
      budget: 25000,
      currency: 'USD',
      city: 'San Francisco',
      theme: 'Modern Botanical Elegance',
      priorityCategory: 'Catering',
      preferences: ['Eco-friendly'],
      notes: 'Elegant outdoor ceremony with farm-to-table dining',
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F5FF] dark:bg-gray-900 text-[#1B1B1F] dark:text-white">
      {/* Top Header */}
      <header className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B3FD9] text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">PlanPilot AI</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/wizard')} variant="primary" size="sm">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:py-20 space-y-20">
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold text-[#1B7F4C] border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="h-4 w-4" /> 1 Connected Plan &bull; 4 Occasions &bull; 6 Gemini Touchpoints
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Plan the celebration, not the spreadsheet.
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            Change the guest count and watch catering, budget allocations, and deadlines adjust together in real time. Built with pure deterministic mathematics and resilient multi-model Gemini AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button onClick={() => navigate('/wizard')} size="lg" variant="primary" className="w-full sm:w-auto">
              Start Planning Now <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button onClick={handleQuickDemo} size="lg" variant="secondary" className="w-full sm:w-auto">
              <Zap className="h-4 w-4 mr-2 text-[#5B3FD9]" /> Try Instant Demo (Emma & David Wedding)
            </Button>
          </div>
        </section>

        {/* 4 Occasions Showcase */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Weddings', desc: 'Venue, catering split, floral decor, photo & ceremony schedule', icon: Heart, count: '12-14 milestones' },
            { title: "Kid's Birthdays", desc: 'Games, entertainment, custom cake & party favors', icon: Gift, count: 'Fun & safe schedule' },
            { title: 'Milestones (50th / Anniversary)', desc: 'Tribute video, AV setup, banquet seating & memories', icon: Trophy, count: 'Decades of memories' },
            { title: 'Community Festivals', desc: 'Permits, stage sound, food distribution & volunteer teams', icon: Users, count: 'Large scale logistics' },
          ].map((occ, i) => {
            const Icon = occ.icon;
            return (
              <div key={i} className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B3FD9]/10 text-[#5B3FD9]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">{occ.title}</h3>
                <p className="text-xs text-gray-500">{occ.desc}</p>
                <div className="pt-2 text-[11px] font-semibold text-[#5B3FD9] flex items-center gap-1">
                  <Check className="h-3 w-3" /> {occ.count}
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-xs text-gray-400">
        &copy; 2026 PlanPilot AI. Built for Google AI Studio. 100% Deterministic Engine with Gemini Failover.
      </footer>
    </div>
  );
}
