import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { CanonicalMedia } from './types';

export interface TrackingItem {
  id: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  addedAt?: string;
  watchedAt?: string;
  rating?: number | null;
}

export interface LibraryItem extends TrackingItem {
  media: CanonicalMedia | null;
}

export interface LibraryData {
  watchlist: LibraryItem[];
  history: LibraryItem[];
}

async function loadLibrary(): Promise<LibraryData> {
  const [watchlistResponse, historyResponse] = await Promise.all([
    api.get<TrackingItem[]>('/tracking/watchlist'),
    api.get<TrackingItem[]>('/tracking/history'),
  ]);

  const all = [...watchlistResponse.data, ...historyResponse.data];
  const unique = [...new Map(all.map((item) => [`${item.mediaType}:${item.tmdbId}`, item])).values()];
  const mediaByKey = new Map<string, CanonicalMedia | null>();

  // Keep provider requests bounded when a user has a larger library.
  for (let offset = 0; offset < unique.length; offset += 5) {
    const batch = unique.slice(offset, offset + 5);
    const results = await Promise.allSettled(batch.map((item) =>
      api.get<CanonicalMedia>(`/media/${item.mediaType}/${item.tmdbId}`)
    ));
    results.forEach((result, index) => {
      const item = batch[index];
      mediaByKey.set(
        `${item.mediaType}:${item.tmdbId}`,
        result.status === 'fulfilled' ? result.value.data : null,
      );
    });
  }

  const hydrate = (item: TrackingItem): LibraryItem => ({
    ...item,
    media: mediaByKey.get(`${item.mediaType}:${item.tmdbId}`) ?? null,
  });

  return {
    watchlist: watchlistResponse.data.map(hydrate),
    history: historyResponse.data.map(hydrate),
  };
}

export function useLibraryData() {
  return useQuery({
    queryKey: ['library'],
    queryFn: loadLibrary,
    staleTime: 5 * 60 * 1000,
  });
}
