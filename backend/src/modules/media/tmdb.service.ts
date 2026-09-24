import axios from 'axios';

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
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

// Helper to format TMDB response into our Canonical format
const formatTmdbToCanonical = (item: any, defaultType: 'movie' | 'tv'): CanonicalMedia => {
  return {
    id: `${defaultType}_${item.id}`,
    tmdbId: item.id,
    title: item.title || item.name,
    originalTitle: item.original_title || item.original_name,
    overview: item.overview,
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    mediaType: item.media_type || defaultType,
    releaseDate: item.release_date || item.first_air_date || null,
    voteAverage: item.vote_average,
    runtime: item.runtime || (item.episode_run_time ? item.episode_run_time[0] : null),
    genres: item.genres,
  };
};

export const TmdbService = {
  async getTrending(timeWindow: 'day' | 'week' = 'day'): Promise<CanonicalMedia[]> {
    const response = await tmdbApi.get(`/trending/all/${timeWindow}`);
    return response.data.results.map((item: any) => formatTmdbToCanonical(item, item.media_type || 'movie'));
  },

  async searchMulti(query: string, page: number = 1): Promise<CanonicalMedia[]> {
    const response = await tmdbApi.get(`/search/multi`, {
      params: { query, page },
    });
    // Filter out people, we only want movies and tv shows
    const results = response.data.results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
    return results.map((item: any) => formatTmdbToCanonical(item, item.media_type));
  },

  async getDetails(tmdbId: number, mediaType: 'movie' | 'tv') {
    const response = await tmdbApi.get(`/${mediaType}/${tmdbId}`, {
      params: { append_to_response: 'credits' }
    });
    
    const canonical = formatTmdbToCanonical(response.data, mediaType);
    
    if (response.data.credits && response.data.credits.cast) {
      canonical.cast = response.data.credits.cast.slice(0, 10).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path
      }));
    }
    
    return canonical;
  }
};
