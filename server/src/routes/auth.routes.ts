import { Router } from 'express';
import { login, logout, session } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/session', session);

export default router;