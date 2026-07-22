import { Request, Response, NextFunction } from 'express';
import { employeeService } from '../services/employee.service';
import { sendSuccess } from '../utils/response';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await employeeService.getDashboardData(req.user!.userId, req.user!.tenantId);
    return sendSuccess(res, data, 'Dashboard data fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getCurrentFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await employeeService.getCurrentFeedback(req.user!.userId, req.user!.tenantId);
    return sendSuccess(res, data, 'Current feedback fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await employeeService.getFeedbackHistory(req.user!.userId);
    return sendSuccess(res, data, 'Feedback history fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getPerformanceTrend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await employeeService.getPerformanceTrend(req.user!.userId);
    return sendSuccess(res, data, 'Performance trend fetched successfully');
  } catch (error) {
    next(error);
  }
};
