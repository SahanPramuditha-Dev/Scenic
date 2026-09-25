import 'dotenv/config';
import axios from 'axios';

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    api_key: TMDB_ACCESS_TOKEN, // The user provided a v3 API key instead of a v4 bearer token
  }
});

export interface CanonicalMedia {
  id: string;
  tmdbId: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  mediaType: 'movie' | 'tv';
  releaseDate: string | null;
  voteAverage: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
  cast?: { id: number; name: string; character: string; profilePath: string | null }[];
}

interface TmdbMedia {
  id: number;
  media_type?: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  runtime?: number;
  episode_run_time?: number[];
  genres?: { id: number; name: string }[];
  credits?: { cast?: { id: number; name: string; character: string; profile_path: string | null }[] };
}

// Helper to format TMDB response into our Canonical format
const formatTmdbToCanonical = (item: TmdbMedia, defaultType: 'movie' | 'tv'): CanonicalMedia => {
  return {
    id: `${defaultType}_${item.id}`,
    tmdbId: item.id,
    title: item.title || item.name || '',
    originalTitle: item.original_title || item.original_name || '',
    overview: item.overview || '',
    posterPath: item.poster_path || null,
    backdropPath: item.backdrop_path || null,
    mediaType: item.media_type === 'tv' || item.media_type === 'movie' ? item.media_type : defaultType,
    releaseDate: item.release_date || item.first_air_date || null,
    voteAverage: item.vote_average || 0,
    runtime: item.runtime || item.episode_run_time?.[0],
    genres: item.genres,
  };
};

export const TmdbService = {
  async getTrending(timeWindow: 'day' | 'week' = 'day'): Promise<CanonicalMedia[]> {
    const response = await tmdbApi.get(`/trending/all/${timeWindow}`);
    return (response.data.results as TmdbMedia[])
      .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item) => formatTmdbToCanonical(item, item.media_type as 'movie' | 'tv'));
  },

  async searchMulti(query: string, page: number = 1): Promise<CanonicalMedia[]> {
    const response = await tmdbApi.get(`/search/multi`, {
      params: { query, page },
    });
    // Filter out people, we only want movies and tv shows
    const results = (response.data.results as TmdbMedia[]).filter((item) => item.media_type === 'movie' || item.media_type === 'tv');
    return results.map((item) => formatTmdbToCanonical(item, item.media_type as 'movie' | 'tv'));
  },

  async getDetails(tmdbId: number, mediaType: 'movie' | 'tv') {
    const response = await tmdbApi.get(`/${mediaType}/${tmdbId}`, {
      params: { append_to_response: 'credits' }
    });
    
    const canonical = formatTmdbToCanonical(response.data, mediaType);
    
    const details = response.data as TmdbMedia;
    if (details.credits?.cast) {
      canonical.cast = details.credits.cast.slice(0, 10).map((c) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path
      }));
    }
    
    return canonical;
  }
};
