# Current Project Phase: Phase 3 verification, then Phase 4 (Organization & Library)

## Status
Phase 3 tracking is implemented in the schema, API, and Media Detail UI. Authentication and database-user mapping have been repaired, but live Firebase/PostgreSQL integration and end-to-end tracking still need verification. TMDB uses a v3 API key.

After end-to-end tracking verification, proceed to **Phase 4: Organization & Library**.

## Immediate Objectives (What to do next)

1. **Build the "Library" Page:**
   - Create a new frontend route (`/library` or `/watchlist`).
   - Fetch the authenticated user's Watchlist and History from the backend (`GET /api/v1/tracking/watchlist` and `GET /api/v1/tracking/history`).
   - Render these items using the existing `MediaCard` component, grouped into distinct tabs or sections (e.g., "Watchlist", "Watched").

2. **Enhance Search Functionality:**
   - The NavBar currently has a Search icon.
   - We need to build a Search UI (either a dropdown modal or a dedicated `/search` route) that calls the existing backend endpoint `GET /api/v1/media/search?q={query}`.

3. **User Profile / Settings UI:**
   - Allow the user to see their basic stats (e.g., "Movies Watched: 12", "Episodes Watched: 45").

## Known Issues / Technical Debt to Address
- **Client-Side State Management:** Currently, the Watchlist/Watched status is fetched individually on the `MediaDetailPage`. For a snappier UX, we should eventually load the user's entire Watchlist/History ID array into a global Zustand store upon login so we can instantly reflect status across all MediaCards in the app without additional API calls.
- **TMDB Hydration:** Our database only stores `tmdbId` and `mediaType` for tracking items. When rendering the Library page, the backend will need to either hydrate these IDs by fetching metadata from TMDB in parallel, OR we need to cache the CanonicalMedia data in our own database so the Library loads instantly. (Caching in PostgreSQL is recommended to avoid TMDB rate limits and slow Library load times).

## Instructions for AI Assistants
Before building the Library page, address the "TMDB Hydration" technical debt mentioned above. Tracking returns IDs, so the frontend needs a hydration service or a media cache to render posters and titles.
