import React from 'react';
import { usePlanStore } from '../../store/planStore.js';
import { checkOverdue } from '../../engine/timeline.js';
import { triggerIcsDownload } from '../../engine/calendar.js';
import { Button } from '../ui/Button';
import { Calendar, CheckCircle2, Circle, Clock, Download, AlertCircle, ArrowRight } from 'lucide-react';

export function TimelineView() {
  const plan = usePlanStore((state) => state.plan);
  const toggleTaskDone = usePlanStore((state) => state.toggleTaskDone);
  const setTaskDelay = usePlanStore((state) => state.setTaskDelay);

  if (!plan) return null;

  return (
    <div className="space-y-8">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Dependency-Aware Timeline</h2>
          <p className="text-xs text-gray-500">Backwards-planned from event date ({plan.brief.date}) with delay ripple propagation</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => triggerIcsDownload(plan)}
          >
            <Download className="h-4 w-4 mr-1.5" />
            Add to Phone Calendar (.ics)
          </Button>
        </div>
      </div>

      {/* 2. Tasks with Delay Testing & Dependency Highlighting */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Milestones & Dependencies</h3>

        <div className="space-y-3">
          {plan.timeline.map((task) => {
            const isOverdue = checkOverdue(task.dueDate, task.done);
            const isDelayed = task.delayedDays > 0;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  task.done
                    ? 'bg-gray-50/60 dark:bg-gray-900/40 opacity-70 border-gray-200 dark:border-gray-700'
                    : isDelayed
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                    : isOverdue
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTaskDone(task.id)}
                    className="mt-0.5 text-gray-400 hover:text-[#5B3FD9] focus:outline-none"
                    aria-label={task.done ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
                  >
                    {task.done ? (
                      <CheckCircle2 className="h-5 w-5 text-[#1B7F4C]" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>
                  <div>
                    <p className={`text-sm font-semibold ${task.done ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                      <span className="font-mono text-[11px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        Due: {task.dueDate}
                      </span>
                      <span className="bg-indigo-50 dark:bg-indigo-950 text-[#5B3FD9] px-2 py-0.5 rounded text-[10px] font-semibold">
                        {task.phase}
                      </span>
                      {isOverdue && !task.done && (
                        <span className="flex items-center gap-1 text-[#B3261E] font-bold text-[10px]">
                          <AlertCircle className="h-3 w-3" /> Overdue
                        </span>
                      )}
                      {isDelayed && (
                        <span className="text-[#8A5A00] font-medium text-[10px]">
                          &bull; Pushed +{task.delayedDays} days by upstream dependency
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delay Simulation Trigger */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setTaskDelay(task.id, 10)}
                    className="text-[11px] px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    title="Simulate delay and see downstream dependencies move"
                  >
                    +10d delay
                  </button>
                  <button
                    onClick={() => setTaskDelay(task.id, 40)}
                    className="text-[11px] px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50"
                    title="Simulate 40-day delay"
                  >
                    +40d delay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Suggested Day-Of Run Sheet */}
      {plan.runsheet && plan.runsheet.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#5B3FD9]" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Day-Of Suggested Run Sheet</h3>
          </div>

          <div className="space-y-2">
            {plan.runsheet.map((item) => (
              <div
                key={item.id}
                className="flex items-start sm:items-center justify-between p-3 rounded-xl bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#5B3FD9] w-20">{item.time}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.activity}</p>
                    <p className="text-[11px] text-gray-500">{item.notes}</p>
                  </div>
                </div>
                <span className="text-[11px] text-gray-600 dark:text-gray-400 font-medium">
                  Lead: {item.lead}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
