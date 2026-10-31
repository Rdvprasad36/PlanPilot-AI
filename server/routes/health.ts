import { Router, Request, Response } from 'express';
import { config } from '../config.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    mode: config.geminiApiKey ? 'ai' : 'fallback',
    timestamp: new Date().toISOString(),
  });
});

export default router;
