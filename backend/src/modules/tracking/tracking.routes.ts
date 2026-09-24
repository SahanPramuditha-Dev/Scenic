import { Router } from 'express';
import { 
  addToWatchlist, 
  removeFromWatchlist, 
  getWatchlist,
  addToHistory,
  getHistory
} from './tracking.controller';

const router = Router();

// Watchlist routes
router.post('/watchlist', addToWatchlist);
router.delete('/watchlist', removeFromWatchlist);
router.get('/watchlist/:userId', getWatchlist);

// History routes
router.post('/history', addToHistory);
router.get('/history/:userId', getHistory);

export default router;
