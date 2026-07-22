import { Router } from 'express';
import { getTeam, submitEvaluation } from '../controllers/manager.controller';
import { authenticate, authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorizeRole('MANAGER'));

router.get('/team', getTeam);
router.post('/evaluations/:id', submitEvaluation);

export default router;
