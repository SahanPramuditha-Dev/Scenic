import { Router } from 'express';
import { 
  addToWatchlist, 
  removeFromWatchlist, 
  getWatchlist,
  addToHistory,
  getHistory,
  removeFromHistory
} from './tracking.controller';
import { requireAuth } from '../auth/auth.middleware';

const router = Router();
router.use(requireAuth);

// Watchlist routes
router.post('/watchlist', addToWatchlist);
router.delete('/watchlist', removeFromWatchlist);
router.get('/watchlist', getWatchlist);

// History routes
router.post('/history', addToHistory);
router.get('/history', getHistory);
router.delete('/history', removeFromHistory);

export default router;
