import { Router } from 'express';
import { requireAuth } from '../auth/auth.middleware';
import { AniListService } from './anilist.service';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const search = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (search.length > 100) return res.status(400).json({ error: 'Search is too long' });
  try {
    return res.json({ results: await AniListService.list(search) });
  } catch (error) {
    console.error('AniList list failed:', error);
    return res.status(502).json({ error: 'Anime catalog is unavailable' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid anime ID' });
  try {
    const anime = await AniListService.detail(id);
    return anime ? res.json(anime) : res.status(404).json({ error: 'Anime not found' });
  } catch (error) {
    console.error('AniList detail failed:', error);
    return res.status(502).json({ error: 'Anime details are unavailable' });
  }
});

export default router;
