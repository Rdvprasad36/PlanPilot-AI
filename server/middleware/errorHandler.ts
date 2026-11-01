import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

const logger = pino();

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const appError = err instanceof AppError ? err : null;
  const statusCode = appError?.statusCode || 500;
  const code = appError?.code || 'INTERNAL_SERVER_ERROR';
  const message = appError?.message || 'An unexpected error occurred';
  const requestId = req.requestId || 'unknown';

  logger.error({ err, requestId, path: req.path }, 'Request error');

  res.status(statusCode).json({
    error: {
      code,
      message,
      requestId,
    },
  });
}
