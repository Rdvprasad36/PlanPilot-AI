import { Router, Request, Response, NextFunction } from 'express';
import { eventBriefSchema } from '../../shared/schemas.js';
import { generateAiPlan } from '../ai/client.js';
import { sanitizeBrief } from '../ai/sanitize.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = eventBriefSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new AppError(400, 'VALIDATION_ERROR', parseResult.error.issues.map(e => e.message).join(', '));
    }

    const sanitizedBrief = sanitizeBrief(parseResult.data);
    const { plan, source } = await generateAiPlan(sanitizedBrief);

    res.json({ data: plan, source });
  } catch (err) {
    next(err);
  }
});

export default router;
