# Architecture Guide

## Layers
1. **Domain (`src/domain/`)**: Pure functions for budget math, timeline scheduling, and validators. Zero React or network dependencies.
2. **Services (`src/services/`)**: API client with AbortController and localStorage persistence.
3. **Store (`src/store/`)**: Zustand state management for plan state and settings.
4. **Components (`src/components/`)**: Accessible presentational components under 150 lines.
5. **Pages (`src/pages/`)**: Route-level lazy loaded pages.
6. **Server (`server/`)**: Thin Express AI proxy with helmet, cors, rate-limiting, Zod validation, Gemini SDK, and LRU cache.
