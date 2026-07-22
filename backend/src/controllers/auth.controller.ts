import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return sendSuccess(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const user = await authService.getUserById(userId);
    return sendSuccess(res, { user }, 'User fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { name, email, avatar, companyName } = req.body;
    const updatedUser = await authService.updateProfile(userId, { name, email, avatar, companyName });
    return sendSuccess(res, { user: updatedUser }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};
