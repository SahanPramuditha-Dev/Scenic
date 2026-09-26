import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { CanonicalMedia } from './types';
import type { Anime } from './anime';
import { useAuthStore } from '../stores/useAuth';

export interface TrackingItem {
  id: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  addedAt?: string;
  watchedAt?: string;
  rating?: number | null;
  status?: 'watching' | 'completed';
  season?: number | null;
  episode?: number | null;
}

export type LibraryItem = (TrackingItem & { provider: 'tmdb'; media: CanonicalMedia | null }) | {
  id: string;
  provider: 'anilist';
  anilistId: number;
  addedAt?: string;
  watchedAt?: string;
  anime: Anime | null;
  rating?: number | null;
  status?: 'watching' | 'completed';
  episodesWatched?: number;
};

interface AnimeTrackingItem {
  id: string;
  anilistId: number;
  addedAt?: string;
  watchedAt?: string;
  rating?: number | null;
  status?: 'watching' | 'completed';
  episodesWatched?: number;
}

export interface LibraryData {
  watchlist: LibraryItem[];
  history: LibraryItem[];
}

async function loadLibrary(): Promise<LibraryData> {
  const [watchlistResponse, historyResponse, animeWatchlistResponse, animeHistoryResponse] = await Promise.all([
    api.get<TrackingItem[]>('/tracking/watchlist'),
    api.get<TrackingItem[]>('/tracking/history'),
    api.get<AnimeTrackingItem[]>('/tracking/anime/watchlist'),
    api.get<AnimeTrackingItem[]>('/tracking/anime/history'),
  ]);

  const all = [...watchlistResponse.data, ...historyResponse.data];
  const unique = [...new Map(all.map((item) => [`${item.mediaType}:${item.tmdbId}`, item])).values()];
  const mediaByKey = new Map<string, CanonicalMedia | null>();
  const animeItems = [...animeWatchlistResponse.data, ...animeHistoryResponse.data];
  const uniqueAnime = [...new Map(animeItems.map((item) => [item.anilistId, item])).values()];
  const animeById = new Map<number, Anime | null>();

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

  for (let offset = 0; offset < uniqueAnime.length; offset += 5) {
    const batch = uniqueAnime.slice(offset, offset + 5);
    const results = await Promise.allSettled(batch.map((item) => api.get<Anime>(`/anime/${item.anilistId}`)));
    results.forEach((result, index) => animeById.set(batch[index].anilistId, result.status === 'fulfilled' ? result.value.data : null));
  }

  const historyByKey = new Map(historyResponse.data.map((item) => [`${item.mediaType}:${item.tmdbId}`, item]));
  const animeHistoryById = new Map(animeHistoryResponse.data.map((item) => [item.anilistId, item]));
  const hydrate = (item: TrackingItem): LibraryItem => ({
    ...historyByKey.get(`${item.mediaType}:${item.tmdbId}`),
    ...item,
    provider: 'tmdb',
    media: mediaByKey.get(`${item.mediaType}:${item.tmdbId}`) ?? null,
  });

  const hydrateAnime = (item: AnimeTrackingItem): LibraryItem => ({
    ...animeHistoryById.get(item.anilistId),
    ...item,
    provider: 'anilist',
    anime: animeById.get(item.anilistId) ?? null,
  });

  return {
    watchlist: [...watchlistResponse.data.map(hydrate), ...animeWatchlistResponse.data.map(hydrateAnime)].sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || '')),
    history: [...historyResponse.data.map(hydrate), ...animeHistoryResponse.data.map(hydrateAnime)].sort((a, b) => (b.watchedAt || '').localeCompare(a.watchedAt || '')),
  };
}

export function useLibraryData() {
  const uid = useAuthStore((state) => state.user?.uid);
  return useQuery({
    queryKey: ['library', uid],
    enabled: Boolean(uid),
    queryFn: loadLibrary,
    staleTime: 5 * 60 * 1000,
  });
}
