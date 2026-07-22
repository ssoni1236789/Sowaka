import { Request, Response, NextFunction } from 'express';
import { managerService } from '../services/manager.service';
import { sendSuccess } from '../utils/response';

export const getTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await managerService.getTeam(req.user!.userId, req.user!.tenantId);
    return sendSuccess(res, data, 'Team data fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const submitEvaluation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = await managerService.submitEvaluation(req.user!.userId, id, req.body);
    return sendSuccess(res, data, 'Evaluation submitted successfully');
  } catch (error) {
    next(error);
  }
};
