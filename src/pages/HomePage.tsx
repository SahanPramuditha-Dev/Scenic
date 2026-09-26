import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Film, Info, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { CanonicalMedia } from '../lib/types';
import { useLibraryData, type LibraryItem } from '../lib/library';
import { MediaCard } from '../components/MediaCard';
import { LibraryCard } from '../components/LibraryCard';
import { NavBar } from '../components/NavBar';

type TimeWindow = 'day' | 'week';
type MediaFilter = 'all' | 'movie' | 'tv';

function PersonalRow({ title, items, emptyText }: { title: string; items: LibraryItem[]; emptyText: string }) {
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
        <Link to="/library" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-300 hover:text-white">
          View library <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {items.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.slice(0, 6).map((item) => <LibraryCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-sm text-zinc-400">
          <span>{emptyText}</span>
          <div className="flex flex-wrap gap-3"><Link to="/search" className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500">Browse movies & TV</Link><Link to="/anime" className="rounded-lg border border-zinc-700 px-4 py-2 font-semibold text-white hover:bg-zinc-800">Explore anime</Link></div>
        </div>
      )}
    </section>
  );
}

export default function HomePage() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('day');
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const { data: trending, isLoading, isError, refetch } = useQuery<CanonicalMedia[]>({
    queryKey: ['trending', timeWindow],
    queryFn: async () => {
      const response = await api.get<{ results: CanonicalMedia[] }>(`/media/trending?timeWindow=${timeWindow}`);
      return response.data.results;
    },
    staleTime: 5 * 60 * 1000,
  });
  const library = useLibraryData();

  const heroMedia = trending?.find((item) => item.backdropPath) ?? trending?.[0];
  const gridMedia = (trending ?? []).filter((item) =>
    item.id !== heroMedia?.id && (mediaFilter === 'all' || item.mediaType === mediaFilter)
  ).slice(0, 18);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <NavBar />
      {isLoading ? (
        <main className="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8">
          <div className="h-[48vh] animate-pulse rounded-3xl bg-zinc-900" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }, (_, index) => <div key={index} className="aspect-[2/3] animate-pulse rounded-xl bg-zinc-900" />)}
          </div>
        </main>
      ) : isError ? (
        <main className="mx-auto max-w-xl px-6 pt-40 text-center">
          <Film className="mx-auto mb-5 h-10 w-10 text-indigo-400" />
          <h1 className="text-2xl font-semibold">Trending titles are unavailable</h1>
          <p className="mt-2 text-zinc-400">The catalog could not be loaded. Check your connection and try again.</p>
          <button onClick={() => void refetch()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium hover:bg-indigo-500">
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </main>
      ) : (
        <main>
          {heroMedia ? (
            <section className="relative flex min-h-[52vh] items-end overflow-hidden pb-10 pt-28 sm:min-h-[56vh] sm:pb-14">
              <div className="absolute inset-0" aria-hidden="true">
                {heroMedia.backdropPath ? (
                  <img src={`https://image.tmdb.org/t/p/original${heroMedia.backdropPath}`} alt="" className="h-full w-full object-cover object-center" />
                ) : <div className="h-full w-full bg-gradient-to-br from-indigo-950 to-zinc-950" />}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/65 to-[#0a0a0a]/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/25" />
              </div>
              <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-8">
                <div className="max-w-2xl">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-300" /> Trending {timeWindow === 'day' ? 'today' : 'this week'}
                  </div>
                  <h1 className="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">{heroMedia.title}</h1>
                  <div className="mt-4 flex items-center gap-3 text-sm text-zinc-300">
                    <span className="rounded-md border border-white/20 px-2 py-1 uppercase">{heroMedia.mediaType === 'tv' ? 'Series' : 'Movie'}</span>
                    {heroMedia.releaseDate && <span>{heroMedia.releaseDate.slice(0, 4)}</span>}
                    {heroMedia.voteAverage > 0 && <span>★ {heroMedia.voteAverage.toFixed(1)} / 10</span>}
                  </div>
                  {heroMedia.overview && <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-200 line-clamp-3 sm:text-lg">{heroMedia.overview}</p>}
                  <Link to={`/media/${heroMedia.mediaType}/${heroMedia.tmdbId}`} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-zinc-950 transition-colors hover:bg-indigo-100">
                    <Info className="h-5 w-5" /> Explore title
                  </Link>
                </div>
              </div>
            </section>
          ) : <div className="mx-auto max-w-[1400px] px-5 pt-36 text-zinc-400 sm:px-8">No trending titles are available right now.</div>}

          <div className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8">
            {library.isError ? (
              <div className="mt-8 rounded-xl border border-amber-700/30 bg-amber-950/20 p-4 text-sm text-amber-200">Your library could not be loaded. <button onClick={() => void library.refetch()} className="underline">Retry</button></div>
            ) : library.isLoading ? (
              <div className="mt-8 h-28 animate-pulse rounded-2xl bg-zinc-900" aria-label="Loading your library" />
            ) : library.data ? (
              library.data.watchlist.length || library.data.history.length ? <>
                <PersonalRow title="Your watchlist" items={library.data.watchlist} emptyText="Save a title from its detail page to start your watchlist." />
                <PersonalRow title="Watching & recently watched" items={library.data.history} emptyText="Track a title from your library to record your watching progress." />
              </> : <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                <div><h2 className="text-lg font-semibold">Start your library</h2><p className="mt-1 text-sm text-zinc-400">Save titles you want to see and mark what you have watched.</p></div>
                <div className="flex flex-wrap gap-3"><Link to="/search" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Browse movies & TV</Link><Link to="/anime" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800">Explore anime</Link></div>
              </div>
            ) : null}

            <section className="mt-16" aria-labelledby="trending-heading">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Discover</p>
                  <h2 id="trending-heading" className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Trending now</h2>
                  <p className="mt-1 text-sm text-zinc-400">Live movie and TV picks from TMDB</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(['day', 'week'] as const).map((window) => <button key={window} onClick={() => setTimeWindow(window)} aria-pressed={timeWindow === window} className={`rounded-lg px-3 py-2 text-sm capitalize ${timeWindow === window ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}>{window === 'day' ? 'Today' : 'This week'}</button>)}
                </div>
              </div>
              <div className="mb-6 flex gap-2" aria-label="Filter media type">
                {([['all', 'All'], ['movie', 'Movies'], ['tv', 'TV series']] as const).map(([value, label]) => <button key={value} onClick={() => setMediaFilter(value)} aria-pressed={mediaFilter === value} className={`rounded-full border px-4 py-1.5 text-sm ${mediaFilter === value ? 'border-indigo-500 bg-indigo-500/15 text-white' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'}`}>{label}</button>)}
              </div>
              {gridMedia.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {gridMedia.map((media) => <MediaCard key={media.id} media={media} />)}
              </div> : <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-400">No titles match this filter right now.</p>}
              <Link to="/search" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-900">Explore more titles <ArrowRight className="h-4 w-4" /></Link>
              <p className="mt-8 text-xs text-zinc-600">Media metadata and artwork provided by TMDB.</p>
            </section>
          </div>
        </main>
      )}
    </div>
  );
}
