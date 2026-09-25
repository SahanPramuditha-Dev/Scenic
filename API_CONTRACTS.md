# Scenic API Contracts

The Node.js/Express API is mounted at `/api/v1`. Except for health, each route below requires `Authorization: Bearer <Firebase ID token>`. The backend verifies the token and derives the database user from it; callers do not supply `userId`.

## Health and identity

- `GET /health` returns `{ "status": "ok", "service": "scenic-api" }` and does not require authentication.
- `GET /users/me` returns the authenticated Scenic user. It creates the database user on first access.

## Media

- `GET /media/trending?timeWindow=day|week` returns `{ "results": CanonicalMedia[] }`; the default window is `day`.
- `GET /media/search?q=...&page=1` returns `{ "results": CanonicalMedia[] }`.
- `GET /media/:mediaType/:id` returns a media detail object. `mediaType` must be `movie` or `tv`, and `id` must be a positive integer.

## Tracking

- `GET /tracking/watchlist` returns the authenticated user's watchlist items.
- `POST /tracking/watchlist` accepts `{ "tmdbId": 12345, "mediaType": "movie" }` and returns the item. Repeating the request returns the existing item.
- `DELETE /tracking/watchlist` accepts the same JSON body and returns `{ "success": true }`, or `404` if absent.
- `GET /tracking/history` returns the authenticated user's watched items.
- `POST /tracking/history` accepts `{ "tmdbId": 12345, "mediaType": "movie", "rating": 8 }` and returns the item. `rating` is optional and must be an integer from 1 to 10. Repeating the request updates the item's `watchedAt` value.

All tracking inputs require a positive integer `tmdbId` and a `mediaType` of `movie` or `tv`. The current history model stores one row per title and does not preserve rewatch events.
