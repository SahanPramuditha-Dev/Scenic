import { Request, Response } from 'express';
import { TmdbService } from './tmdb.service';

export const getTrending = async (req: Request, res: Response) => {
  try {
    const timeWindow = (req.query.timeWindow as 'day' | 'week') || 'day';
    const trending = await TmdbService.getTrending(timeWindow);
    return res.json({ results: trending });
  } catch (error: any) {
    console.error('Error fetching trending media:', error.message);
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
  } catch (error: any) {
    console.error('Error searching media:', error.message);
    return res.status(500).json({ error: 'Failed to search media' });
  }
};
