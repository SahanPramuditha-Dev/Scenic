export function historyFields(body: Record<string, unknown>, type: 'movie' | 'tv' | 'anime') {
  const { rating, status, season, episode, episodesWatched } = body;
  if (rating !== undefined && rating !== null && (!Number.isInteger(rating) || Number(rating) < 1 || Number(rating) > 10)) throw new Error('Rating must be 1–10 or empty');
  if (status !== undefined && status !== 'watching' && status !== 'completed') throw new Error('Invalid watching status');
  if (type === 'movie' && (status === 'watching' || season !== undefined || episode !== undefined || episodesWatched !== undefined)) throw new Error('Episode progress is only available for series and anime');
  for (const [name, value, min] of [['season', season, 1], ['episode', episode, 0], ['episodesWatched', episodesWatched, 0]] as const) {
    if (value !== undefined && (!Number.isInteger(value) || Number(value) < min || Number(value) > 100000)) throw new Error(`Invalid ${name}`);
  }
  if (type === 'anime' && (season !== undefined || episode !== undefined)) throw new Error('Use episodesWatched for anime');
  if (type === 'tv' && episodesWatched !== undefined) throw new Error('Use season and episode for TV');
  return { rating: rating as number | null | undefined, status: status as 'watching' | 'completed' | undefined,
    ...(type === 'tv' ? { season: season as number | undefined, episode: episode as number | undefined } : {}),
    ...(type === 'anime' ? { episodesWatched: episodesWatched as number | undefined } : {}) };
}
