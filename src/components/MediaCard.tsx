import { Link } from 'react-router-dom';
import type { CanonicalMedia } from '../lib/types';

interface MediaCardProps {
  media: CanonicalMedia;
}

export function MediaCard({ media }: MediaCardProps) {
  const imageUrl = media.posterPath 
    ? `https://image.tmdb.org/t/p/w500${media.posterPath}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <Link to={`/media/${media.mediaType}/${media.tmdbId}`} className="group relative overflow-hidden rounded-xl aspect-[2/3] bg-zinc-900 border border-zinc-800 transition-transform hover:scale-105 block">
      <img 
        src={imageUrl} 
        alt={media.title} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{media.title}</h3>
        <p className="text-zinc-300 text-sm mt-1 capitalize">{media.mediaType} • {media.voteAverage.toFixed(1)}/10</p>
      </div>
    </Link>
  );
}
