export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    .replace(/<user_text>/gi, '&lt;user_text&gt;')
    .replace(/<\/user_text>/gi, '&lt;/user_text&gt;')
    .replace(/<user_data>/gi, '&lt;user_data&gt;')
    .replace(/<\/user_data>/gi, '&lt;/user_data&gt;')
    .trim();
}

export function sanitizeBrief(brief: EventBrief): EventBrief {
  return {
    ...brief,
    title: sanitizeInput(brief.title || ''),
    city: sanitizeInput(brief.city || ''),
    theme: sanitizeInput(brief.theme || ''),
    preferences: (brief.preferences || []).map((p: string) => sanitizeInput(p)),
    notes: sanitizeInput(brief.notes || ''),
  };
}
import { EventBrief } from '../../shared/schemas.js';
