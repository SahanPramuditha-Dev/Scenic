import axios from 'axios';

const endpoint = 'https://graphql.anilist.co';
const listQuery = `query AnimeList($search: String) {
  Page(page: 1, perPage: 18) {
    media(type: ANIME, sort: TRENDING_DESC, search: $search, isAdult: false) {
      id title { english romaji native } coverImage { large } bannerImage
      averageScore episodes seasonYear format siteUrl
    }
  }
}`;
const detailQuery = `query AnimeDetail($id: Int) {
  Media(id: $id, type: ANIME) {
    id title { english romaji native } description(asHtml: false)
    coverImage { large } bannerImage averageScore episodes seasonYear format
    status genres siteUrl
  }
}`;

export interface Anime {
  id: number;
  title: { english: string | null; romaji: string | null; native: string | null };
  description?: string | null;
  coverImage: { large: string | null } | null;
  bannerImage: string | null;
  averageScore: number | null;
  episodes: number | null;
  seasonYear: number | null;
  format: string | null;
  status?: string | null;
  genres?: string[];
  siteUrl: string;
}

const cache = new Map<string, { expires: number; value: unknown }>();

async function query<T>(key: string, document: string, variables: object): Promise<T> {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return cached.value as T;

  const response = await axios.post<{ data?: T; errors?: { message: string }[] }>(
    endpoint,
    { query: document, variables },
    { timeout: 10000, headers: { 'Content-Type': 'application/json' } },
  );
  if (!response.data.data || response.data.errors?.length) {
    throw new Error(response.data.errors?.[0]?.message || 'AniList returned no data');
  }
  if (cache.size >= 100) cache.clear();
  cache.set(key, { expires: Date.now() + 5 * 60 * 1000, value: response.data.data });
  return response.data.data;
}

export const AniListService = {
  async list(search?: string): Promise<Anime[]> {
    const normalized = search?.trim().slice(0, 100) || undefined;
    const data = await query<{ Page: { media: Anime[] } }>(
      `list:${normalized?.toLowerCase() || 'trending'}`,
      listQuery,
      { search: normalized || null },
    );
    return data.Page.media;
  },

  async detail(id: number): Promise<Anime | null> {
    const data = await query<{ Media: Anime | null }>(`detail:${id}`, detailQuery, { id });
    return data.Media;
  },
};
