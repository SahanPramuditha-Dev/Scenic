import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ExternalLink, Plus } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import { api } from '../services/api';
import { animeTitle, type Anime } from '../lib/anime';
import { useAuthStore } from '../stores/useAuth';

export default function AnimeDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const anime = useQuery<Anime>({
    queryKey: ['anime-detail', id],
    enabled: Boolean(id && /^\d+$/.test(id)),
    queryFn: async () => (await api.get<Anime>(`/anime/${id}`)).data,
    staleTime: 5 * 60 * 1000,
  });
  const item = anime.data;
  const uid = useAuthStore((state) => state.user?.uid);
  const watchlist = useQuery<{ anilistId: number }[]>({ queryKey: ['anime-watchlist', uid], enabled: Boolean(uid), queryFn: async () => (await api.get('/tracking/anime/watchlist')).data });
  const history = useQuery<{ anilistId: number; status: string }[]>({ queryKey: ['anime-history', uid], enabled: Boolean(uid), queryFn: async () => (await api.get('/tracking/anime/history')).data });
  const inWatchlist = watchlist.data?.some((entry) => entry.anilistId === item?.id) ?? false;
  const isWatched = history.data?.some((entry) => entry.anilistId === item?.id && entry.status === 'completed') ?? false;

  async function toggleWatchlist() {
    if (!item) return;
    setSaving(true);
    setSaveError('');
    try {
      if (inWatchlist) await api.delete('/tracking/anime/watchlist', { data: { anilistId: item.id } });
      else await api.post('/tracking/anime/watchlist', { anilistId: item.id });
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['anime-watchlist'] }), queryClient.invalidateQueries({ queryKey: ['library'] })]);
    } catch {
      setSaveError('Could not update your watchlist. Please try again.');
    } finally { setSaving(false); }
  }

  async function markWatched() {
    if (!item || isWatched) return;
    setSaving(true);
    setSaveError('');
    try {
      await api.post('/tracking/anime/history', { anilistId: item.id, status: 'completed' });
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['anime-history'] }), queryClient.invalidateQueries({ queryKey: ['library'] })]);
    } catch {
      setSaveError('Could not mark this anime as watched. Please try again.');
    } finally { setSaving(false); }
  }

  return <div className="min-h-screen bg-[#0a0a0a] pb-24 text-white">
    <NavBar />
    <main className="mx-auto max-w-[1100px] px-5 pt-28 sm:px-8">
      <Link to="/anime" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to anime</Link>
      {!id || !/^\d+$/.test(id) ? <p className="mt-12 text-zinc-400">Invalid anime ID.</p> : anime.isLoading ? <p className="mt-12 text-zinc-400">Loading anime…</p> : anime.isError || !item ? (
        <div role="alert" className="mt-12 text-zinc-400">Anime details could not be loaded. <button onClick={() => void anime.refetch()} className="text-indigo-300 underline">Retry</button>.</div>
      ) : <>
        {item.bannerImage && <img src={item.bannerImage} alt="" className="mt-8 max-h-80 w-full rounded-2xl object-cover" />}
        <div className="mt-8 grid gap-8 sm:grid-cols-[200px_1fr]">
          {item.coverImage?.large && <img src={item.coverImage.large} alt="" className="w-full max-w-[200px] rounded-xl" />}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Anime · AniList</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">{animeTitle(item)}</h1>
            {item.title.romaji && item.title.romaji !== animeTitle(item) && <p className="mt-2 text-zinc-400">{item.title.romaji}</p>}
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-300">
              {item.format && <span>{item.format.replaceAll('_', ' ')}</span>}
              {item.seasonYear && <span>{item.seasonYear}</span>}
              {item.episodes && <span>{item.episodes} episodes</span>}
              {item.averageScore != null && <span>★ {(item.averageScore / 10).toFixed(1)} / 10</span>}
            </div>
            {item.description && <p className="mt-6 max-w-3xl whitespace-pre-line leading-7 text-zinc-300">{item.description.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")}</p>}
            {item.genres?.length ? <p className="mt-5 text-sm text-zinc-400">{item.genres.join(' · ')}</p> : null}
            {saveError && <p role="alert" className="mt-5 text-sm text-red-300">{saveError}</p>}
            {(watchlist.isError || history.isError) && <p role="alert" className="mt-5 text-sm text-amber-300">Your library status could not be loaded. <button className="underline" onClick={() => { void watchlist.refetch(); void history.refetch(); }}>Retry</button>.</p>}
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => void toggleWatchlist()} disabled={saving || watchlist.isLoading || watchlist.isError} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50">{inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{inWatchlist ? 'In watchlist' : 'Add to watchlist'}</button>
              <button onClick={() => void markWatched()} disabled={saving || history.isLoading || history.isError || isWatched} className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 font-semibold hover:bg-zinc-800 disabled:opacity-50"><Check className="h-4 w-4" />{isWatched ? 'Watched' : 'Mark as watched'}</button>
            </div>
            <Link to="/library" className="mt-5 block text-sm text-indigo-300 hover:text-white">Manage your rating and episode progress in Library</Link>
            {item.siteUrl && <a href={item.siteUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500">View on AniList <ExternalLink className="h-4 w-4" /></a>}
          </div>
        </div>
      </>}
    </main>
  </div>;
}
