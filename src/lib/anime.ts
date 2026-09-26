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

export function animeTitle(anime: Anime): string {
  return anime.title.english || anime.title.romaji || anime.title.native || `Anime #${anime.id}`;
}
