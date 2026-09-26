import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Search } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import { LibraryCard } from '../components/LibraryCard';
import { LibraryActions } from '../components/LibraryActions';
import { animeTitle } from '../lib/anime';
import { useLibraryData } from '../lib/library';

export default function LibraryPage() {
  const [tab, setTab] = useState<'watchlist' | 'history'>('watchlist');
  const library = useLibraryData();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const allItems = library.data?.[tab] ?? [];
  const title = (item: typeof allItems[number]) => item.provider === 'anilist' ? (item.anime ? animeTitle(item.anime) : `Anime #${item.anilistId}`) : item.media?.title || `Title #${item.tmdbId}`;
  const items = allItems.filter((item) => filter === 'all' || (item.provider === 'anilist' ? filter === 'anime' : item.mediaType === filter)).sort((a, b) => sort === 'title' ? title(a).localeCompare(title(b)) : sort === 'rating' ? (b.rating || 0) - (a.rating || 0) : ((b.addedAt || b.watchedAt) || '').localeCompare((a.addedAt || a.watchedAt) || ''));

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 text-white">
      <NavBar />
      <main className="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Your space</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">My library</h1>
        <p className="mt-3 text-zinc-400">Your saved titles, personal ratings, and watching progress.</p>
        <div className="mt-9 flex gap-2 border-b border-zinc-800" role="tablist" aria-label="Library sections">
          <button role="tab" aria-selected={tab === 'watchlist'} onClick={() => setTab('watchlist')} className={`border-b-2 px-4 py-3 text-sm font-medium ${tab === 'watchlist' ? 'border-indigo-400 text-white' : 'border-transparent text-zinc-400 hover:text-white'}`}>Watchlist <span className="ml-1 text-zinc-500">{library.data?.watchlist.length ?? 0}</span></button>
          <button role="tab" aria-selected={tab === 'history'} onClick={() => setTab('history')} className={`border-b-2 px-4 py-3 text-sm font-medium ${tab === 'history' ? 'border-indigo-400 text-white' : 'border-transparent text-zinc-400 hover:text-white'}`}>Watching & watched <span className="ml-1 text-zinc-500">{library.data?.history.length ?? 0}</span></button>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><div className="flex flex-wrap gap-2">{[['all', 'All'], ['movie', 'Movies'], ['tv', 'TV'], ['anime', 'Anime']].map(([value, label]) => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)} className={`rounded-full border px-4 py-2 text-sm ${filter === value ? 'border-indigo-500 bg-indigo-500/15 text-white' : 'border-zinc-800 text-zinc-400'}`}>{label}</button>)}</div><label className="flex items-center gap-2 text-sm text-zinc-400">Sort<select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"><option value="recent">Recently added</option><option value="title">Title A–Z</option><option value="rating">Your rating</option></select></label></div>
        {library.isLoading ? <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{Array.from({ length: 6 }, (_, index) => <div key={index} className="aspect-[2/3] animate-pulse rounded-xl bg-zinc-900" />)}</div> : library.isError ? (
          <div role="alert" className="mt-8 rounded-xl border border-red-500/30 bg-red-950/20 p-6 text-red-300">Your library could not be loaded. <button onClick={() => void library.refetch()} className="underline">Try again</button>.</div>
        ) : items.length ? (
          <div className="mt-8 grid grid-cols-2 items-start gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{items.map((item) => <div key={`${tab}:${item.id}`}><LibraryCard item={item} /><LibraryActions item={item} tab={tab} /></div>)}</div>
        ) : allItems.length ? <p className="mt-8 rounded-xl border border-zinc-800 p-6 text-zinc-400">No titles match this filter. <button onClick={() => setFilter('all')} className="text-indigo-300 underline">Show all</button></p> : (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-16 text-center">
            <Film className="h-10 w-10 text-zinc-500" />
            <h2 className="mt-4 text-xl font-semibold">{tab === 'watchlist' ? 'Your watchlist is empty' : 'Nothing watched yet'}</h2>
            <p className="mt-2 max-w-sm text-sm text-zinc-400">{tab === 'watchlist' ? 'Find a title and save it for later.' : 'Mark a title as watched from its detail page.'}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/search" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500"><Search className="h-4 w-4" /> Browse movies & TV</Link><Link to="/anime" className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold hover:bg-zinc-800">Explore anime</Link></div>
          </div>
        )}
      </main>
    </div>
  );
}
