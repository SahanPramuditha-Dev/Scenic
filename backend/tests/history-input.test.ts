import test from 'node:test';
import assert from 'node:assert/strict';
import { historyFields } from '../src/modules/tracking/history-input';

test('ratings can be changed or cleared, while omitted fields stay unchanged', () => {
  assert.equal(historyFields({ rating: null }, 'movie').rating, null);
  assert.equal(historyFields({}, 'tv').rating, undefined);
  assert.equal(historyFields({ rating: 8 }, 'anime').rating, 8);
});

test('rejects out-of-range ratings and fractional or negative episode progress', () => {
  for (const rating of [0, 11, 1.5, '8']) assert.throws(() => historyFields({ rating }, 'tv'));
  for (const episodesWatched of [-1, 1.5, '3']) assert.throws(() => historyFields({ episodesWatched }, 'anime'));
  assert.throws(() => historyFields({ season: 0 }, 'tv'));
});

test('movie and TV/AniList progress cannot be mixed', () => {
  assert.throws(() => historyFields({ status: 'watching' }, 'movie'));
  assert.throws(() => historyFields({ episodesWatched: 3 }, 'tv'));
  assert.throws(() => historyFields({ season: 1 }, 'anime'));
  assert.deepEqual(historyFields({ status: 'watching', season: 2, episode: 4 }, 'tv'), { rating: undefined, status: 'watching', season: 2, episode: 4 });
});
