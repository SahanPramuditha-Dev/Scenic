import { Router } from 'express';
import prisma from '../../config/prisma';
import { requireAuth } from '../auth/auth.middleware';
import { getOrCreateUser } from '../users/users.controller';
import { historyFields } from './history-input';

const router = Router();
router.use(requireAuth);

function animeId(body: unknown): number | null {
  if (!body || typeof body !== 'object') return null;
  const id = (body as Record<string, unknown>).anilistId;
  return Number.isSafeInteger(id) && (id as number) > 0 ? id as number : null;
}

async function ownerId(uid: Express.Request['user']) {
  if (!uid) throw new Error('Authentication middleware is required');
  return (await getOrCreateUser(uid)).id;
}

router.get('/watchlist', async (req, res) => {
  try {
    return res.json(await prisma.animeWatchlistItem.findMany({ where: { userId: await ownerId(req.user) }, orderBy: { addedAt: 'desc' } }));
  } catch (error) {
    console.error('Failed to load anime watchlist:', error);
    return res.status(500).json({ error: 'Failed to load anime watchlist' });
  }
});

router.post('/watchlist', async (req, res) => {
  const anilistId = animeId(req.body);
  if (!anilistId) return res.status(400).json({ error: 'Valid anilistId is required' });
  try {
    const userId = await ownerId(req.user);
    return res.json(await prisma.animeWatchlistItem.upsert({ where: { userId_anilistId: { userId, anilistId } }, update: {}, create: { userId, anilistId } }));
  } catch (error) {
    console.error('Failed to save anime:', error);
    return res.status(500).json({ error: 'Failed to save anime' });
  }
});

router.delete('/watchlist', async (req, res) => {
  const anilistId = animeId(req.body);
  if (!anilistId) return res.status(400).json({ error: 'Valid anilistId is required' });
  try {
    const count = await prisma.animeWatchlistItem.deleteMany({ where: { userId: await ownerId(req.user), anilistId } });
    return count.count ? res.json({ success: true }) : res.status(404).json({ error: 'Anime not found in watchlist' });
  } catch (error) {
    console.error('Failed to remove anime:', error);
    return res.status(500).json({ error: 'Failed to remove anime' });
  }
});

router.get('/history', async (req, res) => {
  try {
    return res.json(await prisma.animeHistoryItem.findMany({ where: { userId: await ownerId(req.user) }, orderBy: { watchedAt: 'desc' } }));
  } catch (error) {
    console.error('Failed to load anime history:', error);
    return res.status(500).json({ error: 'Failed to load anime history' });
  }
});

router.post('/history', async (req, res) => {
  const anilistId = animeId(req.body);
  if (!anilistId) return res.status(400).json({ error: 'Valid anilistId is required' });
  let fields;
  try { fields = historyFields(req.body, 'anime'); }
  catch (error) { return res.status(400).json({ error: (error as Error).message }); }
  try {
    const userId = await ownerId(req.user);
    return res.json(await prisma.animeHistoryItem.upsert({ where: { userId_anilistId: { userId, anilistId } }, update: fields, create: { userId, anilistId, ...fields } }));
  } catch (error) {
    console.error('Failed to mark anime watched:', error);
    return res.status(500).json({ error: 'Failed to mark anime watched' });
  }
});

router.delete('/history', async (req, res) => {
  const anilistId = animeId(req.body);
  if (!anilistId) return res.status(400).json({ error: 'Valid anilistId is required' });
  try {
    await prisma.animeHistoryItem.deleteMany({ where: { userId: await ownerId(req.user), anilistId } });
    return res.json({ success: true });
  } catch (error) {
    console.error('Failed to remove anime history:', error);
    return res.status(500).json({ error: 'Failed to remove anime history' });
  }
});

export default router;
