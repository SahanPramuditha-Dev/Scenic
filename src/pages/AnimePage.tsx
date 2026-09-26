import { useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Tv } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import { api } from '../services/api';
import { animeTitle, type Anime } from '../lib/anime';

export default function AnimePage() {
  const [params, setParams] = useSearchParams();
  const search = params.get('q')?.trim() || '';
  const [draft, setDraft] = useState(search);
  const anime = useQuery<Anime[]>({
    queryKey: ['anime', search],
    queryFn: async () => (await api.get<{ results: Anime[] }>('/anime', { params: search ? { q: search } : {} })).data.results,
    staleTime: 5 * 60 * 1000,
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    setParams(draft.trim() ? { q: draft.trim() } : {});
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 text-white">
      <NavBar />
      <main className="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Discover · AniList</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Anime</h1>
        <p className="mt-3 text-zinc-400">Explore live anime titles from AniList.</p>
        <form onSubmit={submit} className="mt-8 flex max-w-2xl gap-3">
          <label className="flex flex-1 items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 focus-within:border-indigo-500">
            <Search className="h-5 w-5 shrink-0 text-zinc-500" />
            <span className="sr-only">Anime title to search</span>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={100} placeholder="Search anime" className="w-full bg-transparent py-3.5 text-white outline-none placeholder:text-zinc-500" />
          </label>
          <button type="submit" className="rounded-xl bg-indigo-600 px-5 font-semibold hover:bg-indigo-500">Search</button>
        </form>
        <div className="mb-6 mt-12 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">{search ? `Results for “${search}”` : 'Trending anime'}</h2>
          {search && <Link to="/anime" className="text-sm text-indigo-300 hover:text-white">Clear search</Link>}
        </div>
        {anime.isLoading ? <p className="text-zinc-400">Loading anime…</p> : anime.isError ? (
          <div role="alert" className="rounded-xl border border-red-500/30 bg-red-950/20 p-5 text-red-300">Anime could not be loaded. <button onClick={() => void anime.refetch()} className="underline">Retry</button>.</div>
        ) : anime.data?.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {anime.data.map((item) => <Link key={item.id} to={`/anime/${item.id}`} className="group min-w-0 rounded-xl outline-offset-4 outline-indigo-400">
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 group-hover:border-indigo-400/70">
                {item.coverImage?.large ? <img src={item.coverImage.large} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-zinc-500"><Tv className="h-9 w-9" /></div>}
                {item.averageScore != null && <span className="absolute bottom-3 left-3 rounded-md border border-white/20 bg-black/90 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">★ {(item.averageScore / 10).toFixed(1)}</span>}
              </div>
              <h3 className="mt-3 line-clamp-2 min-h-10 text-sm font-semibold leading-5 group-hover:text-indigo-300">{animeTitle(item)}</h3>
              <p className="mt-1 text-xs text-zinc-500">{item.format?.replaceAll('_', ' ') || 'Anime'}{item.seasonYear ? ` · ${item.seasonYear}` : ''}</p>
            </Link>)}
          </div>
        ) : <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-400">No anime found. Try another title.</p>}
        <p className="mt-8 text-xs text-zinc-600">Anime metadata and artwork provided by AniList.</p>
      </main>
    </div>
  );
}
