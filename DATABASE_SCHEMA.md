# Scenic Database Schema (Prisma)

This document maps out the current PostgreSQL database schema managed via Prisma, as well as the target architecture for the **Personal Entertainment Graph**.

## Core Models (Current)

### `User`
The central model for all user data. Synchronized with Firebase Authentication.
- `id`: String (UUID, Primary Key)
- `firebaseUid`: String (Unique, used to map Firebase tokens to our DB)
- `email`: String (Unique)
- `name`: String?
- `picture`: String?
- `createdAt` / `updatedAt`

### `WatchlistItem`
Represents media the user intends to watch.
- `id`: String (UUID, Primary Key)
- `userId`: String (Foreign Key to User)
- `tmdbId`: Int (The Movie Database ID)
- `mediaType`: String (`"movie"` or `"tv"`)
- `addedAt`: DateTime (Defaults to now)

### `HistoryItem` (Legacy / V1)
*Note: In Phase 4+, this will be evolved into `WatchEvent` to support multiple rewatches and granular episode tracking.*
- `id`: String (UUID, Primary Key)
- `userId`: String (Foreign Key to User)
- `tmdbId`: Int (The Movie Database ID)
- `mediaType`: String (`"movie"` or `"tv"`)
- `rating`: Int?
- `watchedAt`: DateTime (Defaults to now)

---

## Target Architecture: The Personal Entertainment Graph (Phase 4+)

To support Scenic's advanced Analytics and Decision Engine, the database must derive statistics from raw events rather than storing hardcoded metrics.

### 1. Granular Watch Events
Instead of a single `HistoryItem`, we need to record distinct viewing events to calculate rewatches, watch habits, and binges.
- **`WatchEvent`:** `id`, `userId`, `tmdbId`, `mediaType`, `seasonNumber` (optional), `episodeNumber` (optional), `watchedAt`, `watchCount` (e.g., 1st watch vs 3rd rewatch), `rating`.

### 2. Franchises, Universes & Collections
To calculate "MCU is 84% complete" or "Christopher Nolan Filmography", we need relational collection models.
- **`Collection`:** 
  - `id`: String
  - `name`: String (e.g., "Marvel Cinematic Universe", "Studio Ghibli")
  - `type`: Enum (`UNIVERSE`, `FRANCHISE`, `SAGA`, `COLLECTION`, `STUDIO`, `FILMOGRAPHY`)
  - `poster_url`, `backdrop_url`
- **`CollectionMedia`:** 
  - Join table linking `Collection` and TMDB IDs.
  - Includes `release_order` and `chronological_order` to power intelligent Watch Orders and "What am I missing?" features.

### 3. Media Metadata Cache
To prevent rate-limiting and accelerate the Library and Stats dashboards:
- **`MediaCache`:** Store basic TMDB data (Title, Poster, Genres, Runtime) in Postgres.
- **`Genre` / `Theme` / `Person`:** Extracting directors, actors, and sub-genres into our own tables so we can calculate connections (e.g., "You've watched 18 Leonardo DiCaprio movies").

*Note to Developers: Do not manually store `movies_watched = 286`. Always calculate (or actively cache the calculation of) these stats from the underlying `WatchEvent` tables so data corrections automatically propagate.*
