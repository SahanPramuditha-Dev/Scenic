import { Request, Response } from 'express';
import { TmdbService } from './tmdb.service';

export const getTrending = async (req: Request, res: Response) => {
  try {
    const timeWindow = (req.query.timeWindow as 'day' | 'week') || 'day';
    const trending = await TmdbService.getTrending(timeWindow);
    return res.json({ results: trending });
  } catch (error: unknown) {
    console.error('Error fetching trending media:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({ error: 'Failed to fetch trending media' });
  }
};

export const searchMedia = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const page = parseInt((req.query.page as string) || '1', 10);
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await TmdbService.searchMulti(query, page);
    return res.json({ results });
  } catch (error: unknown) {
    console.error('Error searching media:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({ error: 'Failed to search media' });
  }
};

export const getDetails = async (req: Request, res: Response) => {
  try {
    const { mediaType, id } = req.params;
    if (mediaType !== 'movie' && mediaType !== 'tv') {
      return res.status(400).json({ error: 'mediaType must be movie or tv' });
    }
    const parsedId = Number(id);
    if (!Number.isSafeInteger(parsedId) || parsedId <= 0) {
      return res.status(400).json({ error: 'id must be a positive integer' });
    }
    const details = await TmdbService.getDetails(parsedId, mediaType as 'movie' | 'tv');
    return res.json(details);
  } catch (error: unknown) {
    console.error('Error fetching details:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({ error: 'Failed to fetch details' });
  }
};
