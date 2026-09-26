import { Link } from 'react-router-dom';
import { Tv } from 'lucide-react';
import { MediaCard } from './MediaCard';
import { animeTitle } from '../lib/anime';
import type { LibraryItem } from '../lib/library';

export function LibraryCard({ item }: { item: LibraryItem }) {
  if (item.provider === 'tmdb') {
    return item.media ? <MediaCard media={item.media} /> : <Link to={`/media/${item.mediaType}/${item.tmdbId}`} className="flex aspect-[2/3] items-end rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-300 hover:border-indigo-500">{item.mediaType === 'movie' ? 'Movie' : 'Series'} #{item.tmdbId}</Link>;
  }
  return <Link to={`/anime/${item.anilistId}`} className="group min-w-0 rounded-xl outline-offset-4 outline-indigo-400">
    <div className="flex aspect-[2/3] items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 group-hover:border-indigo-400/70">
      {item.anime?.coverImage?.large ? <img src={item.anime.coverImage.large} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /> : <Tv className="h-9 w-9 text-zinc-500" />}
    </div>
    <h3 className="mt-3 line-clamp-2 min-h-10 text-sm font-semibold leading-5 group-hover:text-indigo-300">{item.anime ? animeTitle(item.anime) : `Anime #${item.anilistId}`}</h3>
    <p className="mt-1 text-xs text-zinc-500">Anime{item.anime?.seasonYear ? ` · ${item.anime.seasonYear}` : ''}</p>
  </Link>;
}
