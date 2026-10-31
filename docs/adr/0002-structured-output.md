# ADR 0002: Structured Output with Zod

## Status
Accepted

## Context
AI responses must strictly conform to expected application data shapes to prevent runtime crashes.

## Decision
Use Gemini `responseSchema` along with Zod validation on both server and client.
