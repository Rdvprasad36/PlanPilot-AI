# Traceability Matrix

| Requirement Phrase | Feature Implemented | Source File | Test That Proves It |
|---|---|---|---|
| **GenAI-powered** | Multi-model failover chain (`gemini-3.8-flash` &rarr; `gemini-2.5-flash` &rarr; `gemini-3.1-flash-lite`) with 10-min LRU caching and prompt injection guards | `/server/ai/failover.ts`, `/server/ai/client.ts` | `/server/tests/client.test.ts` |
| **Planning assistant** | Deterministic ranked insights, AI plan reviews, and interactive grounded chat in English & Hinglish | `/src/engine/insights.ts`, `/src/engine/advisor.ts`, `/src/components/assistant/AssistantPanel.tsx` | `/src/tests/engine.test.ts` |
| **Weddings, birthdays, community events** | 4 occasion presets (Wedding, Kid's Birthday, Milestone, Community Festival) with unique budget allocations, milestones, and runsheets | `/src/engine/presets.ts`, `/shared/schemas.ts` | `/src/tests/engine.test.ts`, `/server/tests/routes.test.ts` |
| **Budgets** | Largest remainder rounding (exact 100% sum), category locks, live guest count scaling, and 3 over-budget tradeoff options | `/src/engine/money.ts`, `/src/engine/budget.ts`, `/src/engine/tradeoffs.ts`, `/src/components/budget/BudgetAllocator.tsx` | `/src/tests/engine.test.ts`, `/src/tests/budget.test.ts` |
| **Timelines** | Backwards-planned milestones, BFS delay propagation, dependency cycle detection, short-runway compression, and RFC 5545 `.ics` export | `/src/engine/timeline.ts`, `/src/engine/compression.ts`, `/src/engine/calendar.ts`, `/src/components/timeline/TimelineView.tsx` | `/src/tests/engine.test.ts`, `/src/tests/timeline.test.ts` |
| **Vendor checklists** | Per-occasion checklist, raw quote analyzer (flags missing GST, guest minimums, high advance), and inquiry drafter | `/src/engine/quotes.ts`, `/src/components/vendors/VendorList.tsx` | `/src/tests/engine.test.ts` |
| **Personalized ideas** | Occasion-tuned creative details categorized by theme, food, activities, and budget savers | `/src/components/ideas/IdeaGrid.tsx` | `/src/tests/engine.test.ts` |
| **Accessibility (WCAG 2.1 AA)** | 0 axe violations, dark & light theme contrast >= 4.5:1, semantic landmarks, aria-live announcements | `/src/components/ui/Button.tsx`, `/src/components/ui/TextField.tsx` | `/src/tests/components.test.tsx` |
