# AGENTS.md - PlanPilot AI

## Project Summary & Problem Statement
Create a GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas.

## Commands
- Install: `npm install`
- Dev: `npm run dev`
- Test: `npm test`
- Verify: `npm run verify`

## Rules for AI Agents
1. Read `docs/PRD.md` and `docs/ARCHITECTURE.md` before editing.
2. TypeScript strict; no `any`; no `@ts-ignore` without justification.
3. Validate all external input with Zod from `shared/schemas.ts`.
4. Never expose or log secrets; never add `dangerouslySetInnerHTML`.
5. Keep files under 200 lines and functions under 40 lines.
6. Use semantic HTML first, ARIA only when needed.

## Architecture Map
Client SPA (`src/`) <-> Zustand store <-> API Client <-> Express Server (`server/`) <-> Gemini AI / Fallback Templates.

## Definition of Done
Typed, linted, tested (coverage >= 85%), accessible (axe clean), secure inputs, documented, and traced in `docs/TRACEABILITY.md`.
