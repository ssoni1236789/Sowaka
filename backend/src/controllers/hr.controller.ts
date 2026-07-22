import { Request, Response, NextFunction } from 'express';
import { hrService } from '../services/hr.service';
import { sendSuccess } from '../utils/response';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await hrService.getDashboard(req.user!.tenantId, req.query);
    return sendSuccess(res, data, 'HR Dashboard data fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const createCycle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await hrService.createCycle(req.user!.tenantId, req.body);
    return sendSuccess(res, data, 'Cycle created successfully');
  } catch (error) {
    next(error);
  }
};

export const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await hrService.getEmployees(req.user!.tenantId);
    return sendSuccess(res, data, 'Employees fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getManagers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await hrService.getManagers(req.user!.tenantId);
    return sendSuccess(res, data, 'Managers fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getCycles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await hrService.getCycles(req.user!.tenantId);
    return sendSuccess(res, data, 'Cycles fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as string;
    const data = await hrService.getReviews(req.user!.tenantId, status);
    return sendSuccess(res, data, 'Reviews fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await hrService.getReports(req.user!.tenantId);
    return sendSuccess(res, data, 'Reports fetched successfully');
  } catch (error) {
    next(error);
  }
};
