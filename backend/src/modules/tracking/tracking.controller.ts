import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// WATCHLIST

export const addToWatchlist = async (req: Request, res: Response) => {
  try {
    const { userId, tmdbId, mediaType } = req.body;
    
    if (!userId || !tmdbId || !mediaType) {
      return res.status(400).json({ error: 'userId, tmdbId, and mediaType are required' });
    }

    // Check if already in watchlist
    const existing = await prisma.watchlistItem.findUnique({
      where: {
        userId_tmdbId_mediaType: { userId, tmdbId, mediaType }
      }
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    const item = await prisma.watchlistItem.create({
      data: { userId, tmdbId, mediaType }
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
};

export const removeFromWatchlist = async (req: Request, res: Response) => {
  try {
    const { userId, tmdbId, mediaType } = req.body;
    
    if (!userId || !tmdbId || !mediaType) {
      return res.status(400).json({ error: 'userId, tmdbId, and mediaType are required' });
    }

    await prisma.watchlistItem.delete({
      where: {
        userId_tmdbId_mediaType: { userId, tmdbId, mediaType }
      }
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found in watchlist' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
};

export const getWatchlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const items = await prisma.watchlistItem.findMany({
      where: { userId },
      orderBy: { addedAt: 'desc' }
    });
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

// HISTORY

export const addToHistory = async (req: Request, res: Response) => {
  try {
    const { userId, tmdbId, mediaType, rating } = req.body;
    
    if (!userId || !tmdbId || !mediaType) {
      return res.status(400).json({ error: 'userId, tmdbId, and mediaType are required' });
    }

    // Upsert history item (so we update watchedAt if watched again, or update rating)
    const item = await prisma.historyItem.upsert({
      where: {
        userId_tmdbId_mediaType: { userId, tmdbId, mediaType }
      },
      update: {
        rating: rating !== undefined ? rating : undefined,
        watchedAt: new Date()
      },
      create: {
        userId, tmdbId, mediaType, rating
      }
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add to history' });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const items = await prisma.historyItem.findMany({
      where: { userId },
      orderBy: { watchedAt: 'desc' }
    });
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};
