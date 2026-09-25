import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Plus, Check, Star, Clock, Calendar } from 'lucide-react';
import { useAuthStore } from '../stores/useAuth';
import type { CanonicalMedia } from '../lib/types';
import { useQueryClient } from '@tanstack/react-query';

type MediaDetails = CanonicalMedia & {
  runtime?: number;
  genres?: { id: number; name: string }[];
  cast?: { id: number; name: string; character: string; profilePath: string | null }[];
};

export default function MediaDetailPage() {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [media, setMedia] = useState<MediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = await user?.getIdToken();
        const res = await fetch(`/api/v1/media/${mediaType}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load media');
        const data: MediaDetails = await res.json();
        setMedia(data);
        
        // Also fetch watchlist and history status to see if it's already added
        // (In a full app we'd fetch the user's lists and store in Zustand, but we can query them directly here for now)
        if (user?.uid) {
          const wlRes = await fetch('/api/v1/tracking/watchlist', {
             headers: { Authorization: `Bearer ${token}` }
          });
          if (!wlRes.ok) throw new Error('Failed to load watchlist');
          const wlData: { tmdbId: number; mediaType: string }[] = await wlRes.json();
          setInWatchlist(wlData.some((item) => item.tmdbId === data.tmdbId && item.mediaType === data.mediaType));
          
          const histRes = await fetch('/api/v1/tracking/history', {
             headers: { Authorization: `Bearer ${token}` }
          });
          if (!histRes.ok) throw new Error('Failed to load history');
          const histData: { tmdbId: number; mediaType: string }[] = await histRes.json();
          setIsWatched(histData.some((item) => item.tmdbId === data.tmdbId && item.mediaType === data.mediaType));
        }

      } catch (e) {
        console.error("Failed to fetch media details", e);
        setErrorMessage('Failed to load media details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchDetails();
  }, [id, mediaType, user]);

  const handleToggleWatchlist = async () => {
    if (!user || !media) return;
    try {
      const token = await user.getIdToken();
      
      if (inWatchlist) {
        const response = await fetch('/api/v1/tracking/watchlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ tmdbId: media.tmdbId, mediaType: media.mediaType })
        });
        if (!response.ok) throw new Error('Failed to remove from watchlist');
        setInWatchlist(false);
        void queryClient.invalidateQueries({ queryKey: ['library'] });
      } else {
        const response = await fetch('/api/v1/tracking/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ tmdbId: media.tmdbId, mediaType: media.mediaType })
        });
        if (!response.ok) throw new Error('Failed to add to watchlist');
        setInWatchlist(true);
        void queryClient.invalidateQueries({ queryKey: ['library'] });
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('Could not update watchlist. Please try again.');
    }
  };

  const handleToggleWatched = async () => {
    if (!user || !media) return;
    try {
      const token = await user.getIdToken();
      if (!isWatched) {
        const response = await fetch('/api/v1/tracking/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ tmdbId: media.tmdbId, mediaType: media.mediaType })
        });
        if (!response.ok) throw new Error('Failed to add to history');
        setIsWatched(true);
        void queryClient.invalidateQueries({ queryKey: ['library'] });
        // Usually, if you watch it, you might want to remove it from watchlist, but we'll keep it simple
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('Could not update watch history. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#131316] flex items-center justify-center text-zinc-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!media) return <div className="min-h-screen bg-[#131316] text-white flex items-center justify-center">{errorMessage || 'Not found'}</div>;

  const backdropUrl = media.backdropPath ? `https://image.tmdb.org/t/p/original${media.backdropPath}` : null;
  const posterUrl = media.posterPath ? `https://image.tmdb.org/t/p/w500${media.posterPath}` : null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#131316] text-zinc-100 overflow-x-hidden"
    >
      {/* Hero Backdrop */}
      <div className="relative h-[60vh] w-full">
        {backdropUrl ? (
          <img src={backdropUrl} alt={media.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-zinc-900"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-[#131316]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#131316] via-[#131316]/40 to-transparent"></div>
        
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-8 relative -mt-[20vh] pb-24">
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Poster */}
          <div className="shrink-0 w-64 hidden md:block">
            {posterUrl ? (
              <img src={posterUrl} alt={media.title} className="w-full rounded-xl shadow-2xl shadow-black/50 border border-zinc-800" />
            ) : (
              <div className="w-full aspect-[2/3] bg-zinc-800 rounded-xl"></div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 pt-4">
            {errorMessage && <p role="alert" className="mb-4 text-red-400">{errorMessage}</p>}
            <h1 className="text-5xl font-bold tracking-tight mb-2">{media.title}</h1>
            {media.originalTitle && media.originalTitle !== media.title && (
              <p className="text-zinc-500 text-lg mb-4">{media.originalTitle}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-400 mb-8">
              {media.releaseDate && (
                <div className="flex items-center gap-1.5 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800/50">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  {new Date(media.releaseDate).getFullYear()}
                </div>
              )}
              {media.runtime ? (
                <div className="flex items-center gap-1.5 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800/50">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  {media.runtime} min
                </div>
              ) : null}
              {media.voteAverage ? (
                <div className="flex items-center gap-1.5 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800/50">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {media.voteAverage.toFixed(1)}
                </div>
              ) : null}
              <div className="px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-300 uppercase tracking-wider text-[10px]">
                {media.mediaType === 'tv' ? 'Series' : 'Movie'}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)]">
                <Play className="w-5 h-5 fill-white" /> Play Trailer
              </button>
              
              <button 
                onClick={handleToggleWatchlist}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border ${
                  inWatchlist 
                    ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700' 
                    : 'bg-transparent border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800/50'
                }`}
              >
                {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {inWatchlist ? 'In Watchlist' : 'Watchlist'}
              </button>

              <button 
                onClick={handleToggleWatched}
                disabled={isWatched}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border ${
                  isWatched 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                    : 'bg-transparent border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800/50'
                }`}
              >
                {isWatched ? <Check className="w-5 h-5" /> : <Check className="w-5 h-5 opacity-50" />}
                {isWatched ? 'Watched' : 'Mark as Watched'}
              </button>
            </div>

            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-3 text-zinc-200">Overview</h3>
              <p className="text-zinc-400 leading-relaxed max-w-3xl text-lg">
                {media.overview}
              </p>
            </div>

            {media.genres && media.genres.length > 0 && (
              <div className="mb-10">
                <div className="flex flex-wrap gap-2">
                  {media.genres.map((g) => (
                    <span key={g.id} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-400">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {media.cast && media.cast.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-zinc-200">Top Cast</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {media.cast.map((actor) => (
                    <div key={actor.id} className="w-[120px] shrink-0">
                      <div className="w-full aspect-[2/3] bg-zinc-800 rounded-lg mb-2 overflow-hidden border border-zinc-800/50">
                        {actor.profilePath ? (
                          <img src={`https://image.tmdb.org/t/p/w185${actor.profilePath}`} alt={actor.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No Image</div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-zinc-200 truncate">{actor.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </motion.div>
  );
}
