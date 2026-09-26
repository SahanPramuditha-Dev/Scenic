import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { LibraryItem } from '../lib/library';

export function LibraryActions({ item, tab }: { item: LibraryItem; tab: 'watchlist' | 'history' }) {
  const client = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(item.rating?.toString() || '');
  const isSeries = item.provider === 'anilist' || item.mediaType === 'tv';
  const [status, setStatus] = useState(item.status || (isSeries ? 'watching' : 'completed'));
  const [season, setSeason] = useState(item.provider === 'tmdb' ? item.season ?? 1 : 1);
  const [episode, setEpisode] = useState(item.provider === 'tmdb' ? item.episode ?? 0 : item.episodesWatched ?? 0);
  const base = item.provider === 'anilist' ? '/tracking/anime' : '/tracking';
  const identity = item.provider === 'anilist' ? { anilistId: item.anilistId } : { tmdbId: item.tmdbId, mediaType: item.mediaType };

  async function refresh() {
    await Promise.all(['library', 'anime-watchlist', 'anime-history'].map((key) => client.invalidateQueries({ queryKey: [key] })));
  }

  async function remove() {
    setBusy(true);
    setMessage('');
    try {
      await api.delete(`${base}/${tab}`, { data: identity });
      await refresh();
    } catch { setMessage('Could not remove this title. Try again.'); }
    finally { setBusy(false); }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const progress = !isSeries ? {} : item.provider === 'anilist' ? { episodesWatched: episode } : { season, episode };
    try {
      await api.post(`${base}/history`, { ...identity, rating: rating ? Number(rating) : null, status, ...progress });
      await refresh();
      setEditing(false);
      setMessage('Tracking saved.');
    } catch { setMessage('Could not save tracking. Check the values and try again.'); }
    finally { setBusy(false); }
  }

  const fieldClass = 'mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-white';
  return <div className="mt-3 text-xs">
    {tab === 'history' && <p className="mb-3 leading-5 text-zinc-400">{item.status === 'watching' ? 'Watching' : 'Watched'}{item.rating ? ` · Your rating ${item.rating}/10` : ''}{isSeries && (item.provider === 'anilist' ? ` · ${item.episodesWatched ?? 0} episodes` : ` · S${item.season ?? 1} E${item.episode ?? 0}`)}</p>}
    <div className="flex flex-wrap gap-2"><button disabled={busy} onClick={() => setEditing(!editing)} className="rounded-lg border border-zinc-700 px-3 py-2 text-indigo-300 hover:bg-zinc-800 disabled:opacity-50">{editing ? 'Cancel' : tab === 'watchlist' ? 'Track title' : 'Edit tracking'}</button><button disabled={busy} onClick={() => void remove()} className="rounded-lg px-2 py-2 text-zinc-400 hover:bg-red-950/40 hover:text-red-300 disabled:opacity-50">Remove</button></div>
    {editing && <form onSubmit={(event) => void save(event)} className="mt-3 space-y-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
      {isSeries && <label className="block text-zinc-400">Status<select value={status} onChange={(event) => setStatus(event.target.value as 'watching' | 'completed')} className={fieldClass}><option value="watching">Watching</option><option value="completed">Completed</option></select></label>}
      <label className="block text-zinc-400">Your rating<select value={rating} onChange={(event) => setRating(event.target.value)} className={fieldClass}><option value="">Not rated</option>{Array.from({length: 10}, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}/10</option>)}</select></label>
      {isSeries && <div className="flex gap-2">{item.provider === 'tmdb' && <label className="min-w-0 flex-1 text-zinc-400">Season<input required type="number" min={1} max={100000} value={season} onChange={(event) => setSeason(Number(event.target.value))} className={fieldClass} /></label>}<label className="min-w-0 flex-1 text-zinc-400">{item.provider === 'anilist' ? 'Episodes watched' : 'Episode'}<input required type="number" min={0} max={100000} value={episode} onChange={(event) => setEpisode(Number(event.target.value))} className={fieldClass} /></label></div>}
      <button disabled={busy} className="w-full rounded-lg bg-indigo-600 px-3 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Saving…' : 'Save tracking'}</button>
    </form>}
    {message && <p role="status" className="mt-2 leading-5 text-zinc-300">{message}</p>}
  </div>;
}
