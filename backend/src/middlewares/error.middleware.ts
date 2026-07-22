import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]', err.stack);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  // Handle Prisma errors if necessary or other specific errors
  if (err.name === 'ZodError') {
    return sendError(res, 'Validation Error', 400);
  }

  return sendError(res, 'Internal Server Error', 500);
};
