# AI Prompts & Methodology

- System instruction strictly enforces treating user data as data, never instructions.
- Uses Gemini structured output (`responseMimeType: 'application/json'`, `responseSchema`).
- Post-processes and normalizes budget percentages to 100%.
- Gracefully falls back to deterministic event templates on API failure.
