import React, { useState } from 'react';
import { usePlanStore } from '../../store/planStore.js';
import { IDEA_GROUPS } from '../../../shared/constants.js';
import { Pin, Trash2, Sparkles } from 'lucide-react';

export function IdeaGrid() {
  const plan = usePlanStore((state) => state.plan);
  const togglePinIdea = usePlanStore((state) => state.togglePinIdea);
  const dismissIdea = usePlanStore((state) => state.dismissIdea);

  const [activeGroup, setActiveGroup] = useState<string>('All');

  if (!plan) return null;

  const groups = ['All', ...IDEA_GROUPS];
  const filteredIdeas = plan.ideas.filter(
    (i) => (activeGroup === 'All' || i.group.toLowerCase().includes(activeGroup.toLowerCase())) && !i.dismissed
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personalized Ideas & Inspiration</h2>
          <p className="text-xs text-gray-500">Tuned to your occasion, vibe, and theme "{plan.brief.theme}" in {plan.brief.city}</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-1">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeGroup === group
                ? 'bg-[#5B3FD9] text-white shadow-xs'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIdeas.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <Sparkles className="h-8 w-8 text-[#5B3FD9] mx-auto mb-2" />
            <p className="text-gray-500 text-xs font-medium">No ideas in this category yet.</p>
          </div>
        ) : (
          filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className={`rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-xs border transition-all ${
                idea.pinned
                  ? 'border-[#5B3FD9] ring-2 ring-[#5B3FD9]/10'
                  : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B3FD9] bg-[#5B3FD9]/10 px-2 py-0.5 rounded">
                    {idea.group}
                  </span>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mt-1">{idea.title}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePinIdea(idea.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      idea.pinned ? 'text-[#5B3FD9] bg-[#5B3FD9]/10' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    aria-label={idea.pinned ? `Unpin ${idea.title}` : `Pin ${idea.title}`}
                  >
                    <Pin className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => dismissIdea(idea.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#B3261E] transition-colors"
                    aria-label={`Dismiss ${idea.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">{idea.description}</p>
              <div className="flex items-center justify-between text-xs pt-2.5 border-t border-gray-100 dark:border-gray-700">
                <span className="text-[11px] font-medium text-gray-400">Estimated Cost:</span>
                <span className="font-bold text-[#1B7F4C] bg-[#EAF5F0] dark:bg-emerald-950/40 px-2 py-0.5 rounded text-[11px]">
                  {idea.estCost}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
