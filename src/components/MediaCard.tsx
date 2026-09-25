import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import type { CanonicalMedia } from '../lib/types';

export function MediaCard({ media }: { media: CanonicalMedia }) {
  const [imageFailed, setImageFailed] = useState(false);
  const poster = media.posterPath && !imageFailed ? `https://image.tmdb.org/t/p/w500${media.posterPath}` : null;

  return (
    <Link to={`/media/${media.mediaType}/${media.tmdbId}`} className="group block min-w-0 rounded-xl outline-offset-4 outline-indigo-400">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-colors group-hover:border-indigo-400/70">
        {poster ? (
          <img src={poster} alt="" loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center text-zinc-500"><Film className="h-9 w-9" /><span className="text-sm">Poster unavailable</span></div>
        )}
        {media.voteAverage > 0 && <span className="absolute bottom-3 left-3 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white backdrop-blur">★ {media.voteAverage.toFixed(1)}</span>}
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-zinc-100 group-hover:text-indigo-300">{media.title}</h3>
      <p className="mt-1 text-xs text-zinc-500">{media.mediaType === 'tv' ? 'TV series' : 'Movie'}{media.releaseDate ? ` · ${media.releaseDate.slice(0, 4)}` : ''}</p>
    </Link>
  );
}
