import { Router, Request, Response, NextFunction } from 'express';
import { parseIntakeRequestSchema, extractQuoteRequestSchema, askPlannerRequestSchema, planSchema } from '../../shared/schemas.js';
import { parseIntakeText, extractQuoteData, generatePlanReview, answerPlanQuery } from '../ai/client.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// 1. POST /api/parse-intake
router.post('/parse-intake', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = parseIntakeRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, 'VALIDATION_ERROR', parsed.error.issues.map((e) => e.message).join(', '));
    }
    const result = await parseIntakeText(parsed.data.description);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

// 2. POST /api/extract-quote
router.post('/extract-quote', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = extractQuoteRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, 'VALIDATION_ERROR', parsed.error.issues.map((e) => e.message).join(', '));
    }
    const result = await extractQuoteData(parsed.data.category, parsed.data.quoteText);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

// 3. POST /api/review-plan
router.post('/review-plan', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = planSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Valid plan required for review');
    }
    const review = await generatePlanReview(parsed.data);
    res.json({ data: review });
  } catch (err) {
    next(err);
  }
});

// 4. POST /api/ask-planner
router.post('/ask-planner', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, plan, conversation } = req.body;
    if (!question || !plan) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Question and plan are required');
    }
    const answer = await answerPlanQuery(plan, question, conversation || []);
    res.json({ data: answer });
  } catch (err) {
    next(err);
  }
});

export default router;
