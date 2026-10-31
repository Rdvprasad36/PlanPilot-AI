# ADR 0001: Server-Side AI Proxy

## Status
Accepted

## Context
Gemini API keys must never be exposed in client-side code or browser bundles.

## Decision
Implement a thin Express backend proxy (`server/`) that handles all calls to `@google/genai`.
