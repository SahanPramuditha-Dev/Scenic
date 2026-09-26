import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Plus, Check, Star, Clock, Calendar } from 'lucide-react';
import { useAuthStore } from '../stores/useAuth';
import type { CanonicalMedia } from '../lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { NavBar } from '../components/NavBar';
import { api } from '../services/api';

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
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const castRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = (await api.get<MediaDetails>(`/media/${mediaType}/${id}`)).data;
        setMedia(data);
        
        // Also fetch watchlist and history status to see if it's already added
        // (In a full app we'd fetch the user's lists and store in Zustand, but we can query them directly here for now)
        if (user?.uid) {
          const wlData = (await api.get<{ tmdbId: number; mediaType: string }[]>('/tracking/watchlist')).data;
          setInWatchlist(wlData.some((item) => item.tmdbId === data.tmdbId && item.mediaType === data.mediaType));
          
          const histData = (await api.get<{ tmdbId: number; mediaType: string; status: string }[]>('/tracking/history')).data;
          setIsWatched(histData.some((item) => item.tmdbId === data.tmdbId && item.mediaType === data.mediaType && item.status === 'completed'));
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
    if (!user || !media || isSaving) return;
    setIsSaving(true);
    setErrorMessage('');
    setStatusMessage('');
    try {
      if (inWatchlist) {
        await api.delete('/tracking/watchlist', { data: { tmdbId: media.tmdbId, mediaType: media.mediaType } });
        setInWatchlist(false);
        setStatusMessage('Removed from your watchlist.');
        void queryClient.invalidateQueries({ queryKey: ['library'] });
      } else {
        await api.post('/tracking/watchlist', { tmdbId: media.tmdbId, mediaType: media.mediaType });
        setInWatchlist(true);
        setStatusMessage('Saved to your watchlist.');
        void queryClient.invalidateQueries({ queryKey: ['library'] });
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('Could not update watchlist. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleWatched = async () => {
    if (!user || !media || isSaving) return;
    setIsSaving(true);
    setErrorMessage('');
    setStatusMessage('');
    try {
      if (!isWatched) {
        await api.post('/tracking/history', { tmdbId: media.tmdbId, mediaType: media.mediaType, status: 'completed' });
        setIsWatched(true);
        setStatusMessage('Marked as watched.');
        void queryClient.invalidateQueries({ queryKey: ['library'] });
        // Usually, if you watch it, you might want to remove it from watchlist, but we'll keep it simple
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('Could not update watch history. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-400"><NavBar />
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!media) return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center"><NavBar />{errorMessage || 'Not found'}</div>;

  const backdropUrl = media.backdropPath ? `https://image.tmdb.org/t/p/original${media.backdropPath}` : null;
  const posterUrl = media.posterPath ? `https://image.tmdb.org/t/p/w500${media.posterPath}` : null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0a] text-zinc-100 overflow-x-hidden"
    >
      <NavBar />
      {/* Hero Backdrop */}
      <div className="relative h-[38vh] w-full sm:h-[42vh]">
        {backdropUrl ? (
          <img src={backdropUrl} alt={media.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-zinc-900"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
        
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="absolute top-24 left-5 rounded-full bg-black/50 p-3 text-white backdrop-blur-md transition-colors hover:bg-black/70 sm:left-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="relative mx-auto -mt-[14vh] max-w-[1400px] px-5 pb-24 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row lg:gap-10">
          
          {/* Poster */}
          <div className="shrink-0 w-64 hidden md:block">
            {posterUrl ? (
              <img src={posterUrl} alt={media.title} className="w-full rounded-xl shadow-2xl shadow-black/50 border border-zinc-800" />
            ) : (
              <div className="w-full aspect-[2/3] bg-zinc-800 rounded-xl"></div>
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1 pt-4">
            {errorMessage && <p role="alert" className="mb-4 text-red-400">{errorMessage}</p>}
            {statusMessage && <p role="status" className="mb-4 text-emerald-300">{statusMessage}</p>}
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
                  TMDB {media.voteAverage.toFixed(1)}/10
                </div>
              ) : null}
              <div className="px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-300 uppercase tracking-wider text-[10px]">
                {media.mediaType === 'tv' ? 'Series' : 'Movie'}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button 
                onClick={handleToggleWatchlist}
                disabled={isSaving}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border ${
                  inWatchlist 
                    ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700' 
                    : 'bg-transparent border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800/50'
                }`}
              >
                {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {inWatchlist ? 'Saved to watchlist' : 'Add to watchlist'}
              </button>

              <button 
                onClick={handleToggleWatched}
                disabled={isWatched || isSaving}
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

            <Link to="/library" className="mb-8 inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-white">Manage your rating{media.mediaType === 'tv' ? ' and episode progress' : ''} in Library <ArrowRight className="h-4 w-4" /></Link>
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
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div><h3 className="text-xl font-semibold text-zinc-200">Top Cast</h3><p className="mt-1 text-xs text-zinc-500">Scroll to see more cast</p></div>
                  <div className="flex gap-2"><button type="button" onClick={() => castRef.current?.scrollBy({ left: -408, behavior: 'smooth' })} aria-label="Scroll cast left" className="rounded-full border border-zinc-700 p-2 text-zinc-300 hover:bg-zinc-800"><ArrowLeft className="h-4 w-4" /></button><button type="button" onClick={() => castRef.current?.scrollBy({ left: 408, behavior: 'smooth' })} aria-label="Scroll cast right" className="rounded-full border border-zinc-700 p-2 text-zinc-300 hover:bg-zinc-800"><ArrowRight className="h-4 w-4" /></button></div>
                </div>
                <div ref={castRef} tabIndex={0} aria-label="Top cast" className="cast-scroll flex max-w-full gap-4 overflow-x-auto scroll-smooth pb-4">
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
