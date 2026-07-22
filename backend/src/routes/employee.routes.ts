import { Router } from 'express';
import { getDashboard, getCurrentFeedback, getHistory, getPerformanceTrend } from '../controllers/employee.controller';
import { authenticate, authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorizeRole('EMPLOYEE', 'MANAGER', 'HR')); // Anyone can technically see their own employee dashboard if they want, but usually EMPLOYEE. 
// We'll just enforce authenticate and let the user fetch their own data based on token.

router.get('/dashboard', getDashboard);
router.get('/feedback/current', getCurrentFeedback);
router.get('/feedback/history', getHistory);
router.get('/performance-trend', getPerformanceTrend);

export default router;
