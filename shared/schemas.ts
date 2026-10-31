import { z } from 'zod';

export const occasionSchema = z.enum(['wedding', 'birthday', 'milestone', 'community']);
export type Occasion = z.infer<typeof occasionSchema>;

export const prioritySchema = z.enum(['low', 'med', 'high']);
export type Priority = z.infer<typeof prioritySchema>;

export const vendorStatusSchema = z.enum(['not_started', 'contacted', 'quoted', 'booked', 'paid']);
export type VendorStatus = z.infer<typeof vendorStatusSchema>;

export const eventBriefSchema = z.object({
  occasion: occasionSchema.default('wedding'),
  type: occasionSchema.optional(), // backward compatibility
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  date: z.string().min(1, 'Date is required').refine((d) => {
    const ts = Date.parse(d);
    return !isNaN(ts) && ts >= Date.now() - 86400000;
  }, 'Event date must be in the future'),
  guests: z.number().int().min(1, 'At least 1 guest required').max(5000),
  budget: z.number().int().min(100, 'Budget must be at least 100'),
  currency: z.string().default('INR'),
  city: z.string().min(1, 'City is required').max(100),
  theme: z.string().max(100).default('Traditional & Modern Fusion'),
  priorityCategory: z.string().optional(), // "what matters most" e.g. "Catering"
  preferences: z.array(z.string()).default([]),
  notes: z.string().max(500).default(''),
});
export type EventBrief = z.infer<typeof eventBriefSchema>;

export const budgetItemSchema = z.object({
  id: z.string(),
  category: z.string(),
  percent: z.number().min(0).max(100),
  planned: z.number().int().min(0),
  actual: z.number().int().min(0).default(0),
  locked: z.boolean().default(false),
  isContingency: z.boolean().default(false),
  notes: z.string().default(''),
});
export type BudgetItem = z.infer<typeof budgetItemSchema>;

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  dueDate: z.string(),
  category: z.string(),
  phase: z.string().default('Planning'),
  done: z.boolean().default(false),
  priority: prioritySchema.default('med'),
  daysBeforeEvent: z.number().int().default(30),
  dependsOn: z.string().optional(), // Task ID that this task depends on
  delayedDays: z.number().int().default(0),
  notes: z.string().default(''),
});
export type Task = z.infer<typeof taskSchema>;

export const runsheetItemSchema = z.object({
  id: z.string(),
  time: z.string(),
  activity: z.string(),
  lead: z.string(),
  notes: z.string().default(''),
});
export type RunsheetItem = z.infer<typeof runsheetItemSchema>;

export const vendorQuoteSchema = z.object({
  id: z.string(),
  category: z.string(),
  vendorName: z.string(),
  quoteAmount: z.number().int().min(0),
  pricePerPlate: z.number().nullable().optional(),
  guestMinimum: z.number().nullable().optional(),
  taxIncluded: z.boolean().nullable().optional(),
  advancePercent: z.number().nullable().optional(),
  cancellationPolicy: z.string().nullable().optional(),
  status: vendorStatusSchema.default('quoted'),
  contact: z.string().default(''),
  notes: z.string().default(''),
});
export type VendorQuote = z.infer<typeof vendorQuoteSchema>;

export const ideaSchema = z.object({
  id: z.string(),
  group: z.string(),
  title: z.string(),
  description: z.string(),
  estCost: z.string(),
  pinned: z.boolean().default(false),
  dismissed: z.boolean().default(false),
});
export type Idea = z.infer<typeof ideaSchema>;

export const planSchema = z.object({
  version: z.number().default(1),
  brief: eventBriefSchema,
  budget: z.array(budgetItemSchema),
  timeline: z.array(taskSchema),
  runsheet: z.array(runsheetItemSchema).default([]),
  vendors: z.array(vendorQuoteSchema).default([]),
  ideas: z.array(ideaSchema).default([]),
  perPlateEstimate: z.number().default(0),
  createdAt: z.string(),
  source: z.enum(['ai', 'fallback', 'local-planner']).default('ai'),
  modelUsed: z.string().default('gemini-3.8-flash'),
});
export type Plan = z.infer<typeof planSchema>;

// API Schemas
export const parseIntakeRequestSchema = z.object({
  description: z.string().min(5).max(1000),
});

export const extractQuoteRequestSchema = z.object({
  category: z.string().default('Catering'),
  quoteText: z.string().min(10).max(3000),
});

export const explainTradeoffsRequestSchema = z.object({
  brief: eventBriefSchema,
  overspendAmount: z.number(),
  options: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      action: z.string(),
      rupeeImpact: z.number(),
    })
  ),
});

export const askPlannerRequestSchema = z.object({
  question: z.string().min(2).max(300),
  facts: z.record(z.any()),
  conversation: z.array(z.object({ role: z.enum(['user', 'assistant']), text: z.string() })).default([]),
});
