import { Router } from 'express';
import { getTrending, searchMedia, getDetails } from './media.controller';
import { requireAuth } from '../auth/auth.middleware';

const router = Router();

// Protect these routes so only logged in users can access the catalog
router.use(requireAuth);

router.get('/trending', getTrending);
router.get('/search', searchMedia);
router.get('/:mediaType/:id', getDetails);

export default router;
