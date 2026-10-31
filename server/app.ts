import express from 'express';
import { requestIdMiddleware } from './middleware/requestId.js';
import { securityHeaders, corsMiddleware } from './middleware/security.js';
import { aiRateLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import planRouter from './routes/plan.js';
import assistantRouter from './routes/assistant.js';
import healthRouter from './routes/health.js';

export function createApp() {
  const app = express();

  // Trust first proxy (nginx/ingress/cloud run) for accurate client IP in express-rate-limit
  app.set('trust proxy', 1);

  app.use(requestIdMiddleware);
  app.use(securityHeaders);
  app.use(corsMiddleware);
  app.use(express.json({ limit: '50kb' }));

  // API Routes with rate limiting
  app.use('/api/health', healthRouter);
  app.use('/api/plan', aiRateLimiter, planRouter);
  app.use('/api', aiRateLimiter, assistantRouter);

  // Error handling for API routes
  app.use(errorHandler);

  return app;
}
