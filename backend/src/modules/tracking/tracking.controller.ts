import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { getOrCreateUser } from '../users/users.controller';

function trackingInput(body: unknown): { tmdbId: number; mediaType: 'movie' | 'tv' } | null {
  if (!body || typeof body !== 'object') return null;
  const { tmdbId, mediaType } = body as Record<string, unknown>;
  if (!Number.isSafeInteger(tmdbId) || (tmdbId as number) <= 0) return null;
  if (mediaType !== 'movie' && mediaType !== 'tv') return null;
  return { tmdbId: tmdbId as number, mediaType };
}

async function userId(req: Request): Promise<string> {
  if (!req.user) throw new Error('Authentication middleware is required');
  return (await getOrCreateUser(req.user)).id;
}

export const addToWatchlist = async (req: Request, res: Response) => {
  const input = trackingInput(req.body);
  if (!input) return res.status(400).json({ error: 'Valid tmdbId and mediaType are required' });
  try {
    const ownerId = await userId(req);
    const item = await prisma.watchlistItem.upsert({
      where: { userId_tmdbId_mediaType: { userId: ownerId, ...input } },
      update: {},
      create: { userId: ownerId, ...input },
    });
    return res.status(200).json(item);
  } catch (error) {
    console.error('Failed to add to watchlist:', error);
    return res.status(500).json({ error: 'Failed to add to watchlist' });
  }
};

export const removeFromWatchlist = async (req: Request, res: Response) => {
  const input = trackingInput(req.body);
  if (!input) return res.status(400).json({ error: 'Valid tmdbId and mediaType are required' });
  try {
    const ownerId = await userId(req);
    const result = await prisma.watchlistItem.deleteMany({ where: { userId: ownerId, ...input } });
    if (!result.count) return res.status(404).json({ error: 'Item not found in watchlist' });
    return res.json({ success: true });
  } catch (error) {
    console.error('Failed to remove from watchlist:', error);
    return res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
};

export const getWatchlist = async (req: Request, res: Response) => {
  try {
    const ownerId = await userId(req);
    const items = await prisma.watchlistItem.findMany({
      where: { userId: ownerId }, orderBy: { addedAt: 'desc' },
    });
    return res.json(items);
  } catch (error) {
    console.error('Failed to fetch watchlist:', error);
    return res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

export const addToHistory = async (req: Request, res: Response) => {
  const input = trackingInput(req.body);
  if (!input) return res.status(400).json({ error: 'Valid tmdbId and mediaType are required' });
  const rating = (req.body as Record<string, unknown>).rating;
  if (rating !== undefined && (!Number.isInteger(rating) || (rating as number) < 1 || (rating as number) > 10)) {
    return res.status(400).json({ error: 'rating must be an integer from 1 to 10' });
  }
  try {
    const ownerId = await userId(req);
    const item = await prisma.historyItem.upsert({
      where: { userId_tmdbId_mediaType: { userId: ownerId, ...input } },
      update: { rating: rating as number | undefined, watchedAt: new Date() },
      create: { userId: ownerId, ...input, rating: rating as number | undefined },
    });
    return res.status(200).json(item);
  } catch (error) {
    console.error('Failed to add to history:', error);
    return res.status(500).json({ error: 'Failed to add to history' });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const ownerId = await userId(req);
    const items = await prisma.historyItem.findMany({
      where: { userId: ownerId }, orderBy: { watchedAt: 'desc' },
    });
    return res.json(items);
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
};
