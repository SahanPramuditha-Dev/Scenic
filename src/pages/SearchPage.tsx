import { useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { MediaCard } from '../components/MediaCard';
import { api } from '../services/api';
import type { CanonicalMedia } from '../lib/types';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q')?.trim() ?? '';
  const [draft, setDraft] = useState(query);
  const [type, setType] = useState<'all' | 'movie' | 'tv'>('all');
  const search = useQuery<CanonicalMedia[]>({
    queryKey: ['media-search', query],
    enabled: query.length >= 2,
    queryFn: async () => {
      const response = await api.get<{ results: CanonicalMedia[] }>('/media/search', { params: { q: query } });
      return response.data.results;
    },
    staleTime: 5 * 60 * 1000,
  });
  const trending = useQuery<CanonicalMedia[]>({
    queryKey: ['trending', 'day'],
    enabled: !query,
    queryFn: async () => (await api.get<{ results: CanonicalMedia[] }>('/media/trending?timeWindow=day')).data.results,
    staleTime: 5 * 60 * 1000,
  });
  const results = (search.data ?? []).filter((item) => type === 'all' || item.mediaType === type);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = draft.trim();
    setParams(value ? { q: value } : {});
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 text-white">
      <NavBar />
      <main className="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Discover</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Search movies and TV</h1>
        <p className="mt-3 max-w-xl text-zinc-400">Find a title, explore its details, and add it to your library.</p>
        <form onSubmit={submit} className="mt-8 flex max-w-2xl gap-3">
          <label className="flex flex-1 items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 focus-within:border-indigo-500">
            <Search className="h-5 w-5 shrink-0 text-zinc-500" />
            <span className="sr-only">Title to search</span>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Search for a movie or series" className="w-full bg-transparent py-3.5 text-white outline-none placeholder:text-zinc-500" />
          </label>
          <button type="submit" disabled={draft.trim().length < 2} className="rounded-xl bg-indigo-600 px-5 font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">Search</button>
        </form>
        {query.length >= 2 && <>
          <div className="mb-6 mt-12 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Results for “{query}”</h2>
              <p className="mt-1 text-sm text-zinc-500">Movie and TV metadata from TMDB</p>
            </div>
            <div className="flex gap-2" aria-label="Filter search results">
              {([['all', 'All'], ['movie', 'Movies'], ['tv', 'TV']] as const).map(([value, label]) => <button key={value} onClick={() => setType(value)} aria-pressed={type === value} className={`rounded-full border px-4 py-1.5 text-sm ${type === value ? 'border-indigo-500 bg-indigo-500/15 text-white' : 'border-zinc-800 text-zinc-400 hover:text-white'}`}>{label}</button>)}
            </div>
          </div>
          {search.isLoading ? <p className="text-zinc-400">Searching…</p> : search.isError ? <div role="alert" className="rounded-xl border border-red-500/30 bg-red-950/20 p-5 text-red-300">Search failed. <button onClick={() => void search.refetch()} className="underline">Try again</button>.</div> : results.length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{results.map((media) => <MediaCard key={media.id} media={media} />)}</div>
          ) : <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-400">No titles found. Try another search or filter.</div>}
        </>}
        {!query && <section className="mt-14">
          <h2 className="mb-6 text-2xl font-semibold">Trending now</h2>
          {trending.isLoading ? <p className="text-zinc-400">Loading titles…</p> : trending.isError ? <div role="alert" className="rounded-xl border border-red-500/30 bg-red-950/20 p-5 text-red-300">Trending titles could not be loaded. <button onClick={() => void trending.refetch()} className="underline">Retry</button>.</div> : <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{trending.data?.map((media) => <MediaCard key={media.id} media={media} />)}</div>}
        </section>}
      </main>
    </div>
  );
}
