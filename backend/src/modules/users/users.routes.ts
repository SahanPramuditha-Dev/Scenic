import { Router } from 'express';
import { getCurrentUser } from './users.controller';
import { requireAuth } from '../auth/auth.middleware';

const router = Router();

// GET /api/v1/users/me
router.get('/me', requireAuth, getCurrentUser);

export default router;
