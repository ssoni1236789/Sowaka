import { Router } from 'express';
import { 
  getDashboard, 
  createCycle, 
  getEmployees, 
  getManagers, 
  getCycles, 
  getReviews, 
  getReports 
} from '../controllers/hr.controller';
import { authenticate, authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorizeRole('HR'));

router.get('/dashboard', getDashboard);
router.post('/cycles', createCycle);
router.get('/employees', getEmployees);
router.get('/managers', getManagers);
router.get('/cycles', getCycles);
router.get('/reviews', getReviews);
router.get('/reports', getReports);

export default router;
