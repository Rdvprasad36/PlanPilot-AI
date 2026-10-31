import { eventBriefSchema, EventBrief } from '../../shared/schemas.js';

export function validateEventBrief(data: unknown): { success: boolean; data?: EventBrief; error?: string } {
  const result = eventBriefSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.issues[0]?.message || 'Invalid input' };
}
