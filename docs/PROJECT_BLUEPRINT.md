# Scenic — Pre-Development Product Blueprint

Status: Proposed baseline  
Purpose: Align product, design, architecture, and delivery decisions before feature implementation begins.

## 1. Product North Star

Scenic is a personal entertainment intelligence platform, not a general-purpose media database.

Core loop:

`Discover → Watch → Track → Analyze → Recommend → Improve`

Primary promise:

> One entertainment identity for movies, television, and anime—with recommendations that improve as the user tracks and rates content.

The first meaningful user outcome is reached when a new user selects favorite titles, receives an initial Entertainment DNA profile, and sees several explainable recommendations.

### Initial audience

People who consume movies, TV, and anime and currently split their tracking between services such as Letterboxd, Trakt, IMDb, and MyAnimeList.

### Product principles

1. Tracking must take seconds, especially episode updates.
2. Anime is a first-class media domain, not a TV filter.
3. Recommendations always explain why a title fits.
4. User progress establishes a platform-wide spoiler boundary.
5. External providers own general metadata; Scenic owns personal and community data.
6. Intelligence begins with transparent rules and content similarity, not pretend-ML.
7. Every major feature must strengthen the core product loop.

## 2. Scope Strategy

### Release 1: Core loop

- Account creation, sign-in, email verification, and account recovery
- Short favorite-title onboarding with optional preference questions
- Unified search for movies, TV, and anime
- Media detail pages
- Library statuses and favorites
- Movie watch logging and rewatches
- Season and episode progress
- Continue Watching
- Ratings and chronological watch history
- Personalized home
- Entertainment DNA v1
- Explainable, content-based recommendations
- Basic recommendation feedback
- Time-based Smart Planner

### Release 2: Depth and retention

- Advanced discovery and filtering
- Streaming-provider and region preferences
- Release calendar and notifications
- Statistics and activity heatmap
- Hidden Gems and Escape My Comfort Zone
- Goals, achievements, taste evolution, and annual Wrapped
- Data import/export

### Release 3: Community

- Public profiles and privacy controls
- Follows and activity feed
- Reviews, comments, reports, and moderation
- Public, private, ranked, and collaborative lists
- Taste compatibility and group planner

### Release 4: Advanced intelligence

- Collaborative filtering
- Hybrid recommendations
- Calibrated predictive models
- Progress-aware conversational assistant
- More advanced planning and group recommendation models

### Explicitly deferred from Release 1

Direct messaging, offline PWA behavior, mobile apps, complex gamification, full character/voice-actor databases, advanced franchise timelines, collaborative filtering, and LLM-generated recommendations.

## 3. Brand and Visual Theme

### Visual thesis: “Cinematic Observatory”

The interface should feel like a quiet, premium observatory for a user's entertainment life: deep theater-like surfaces, luminous poster art, crisp analytical overlays, and restrained motion. It should not resemble a streaming-service clone or a generic admin dashboard.

### Brand personality

- Intelligent, cinematic, personal, curious
- Premium without feeling luxurious or exclusive
- Dense enough for enthusiasts, approachable for casual users
- Data-rich without becoming clinical

### Color system

Use semantic design tokens rather than colors directly inside components.

| Token | Dark theme baseline | Purpose |
| --- | --- | --- |
| `canvas` | `#080A10` | App background |
| `surface-1` | `#10141D` | Main cards and panels |
| `surface-2` | `#171D29` | Raised and interactive surfaces |
| `border` | `#293142` | Dividers and quiet borders |
| `text-primary` | `#F4F7FB` | Primary content |
| `text-secondary` | `#AAB4C4` | Metadata and descriptions |
| `accent` | `#7C5CFF` | Brand and primary action |
| `accent-cyan` | `#29D3E2` | Intelligence, progress, and data |
| `success` | `#3DDC97` | Completed and positive state |
| `warning` | `#F7B955` | Upcoming and caution state |
| `danger` | `#FF667A` | Destructive and error state |

Dark mode is the signature theme. Light, OLED, and system themes can follow after the base system is stable. Poster colors may influence local gradients but must not alter semantic status colors.

### Typography

- Display: **Space Grotesk** or a metrically compatible self-hosted alternative
- UI/body: **Inter** or system sans fallback
- Numeric analytics: tabular numerals from the UI font
- Body text: 16px minimum baseline
- Frequent labels: 14px minimum baseline
- Metadata: 12–13px only where genuinely secondary

### Shape and depth

- Cards: 12–16px radius
- Buttons and inputs: 10–12px radius
- Pills: fully rounded only for compact status/filter controls
- Borders are preferred over heavy shadows
- Poster and backdrop imagery provides most visual depth
- Blur is reserved for navigation overlays and spoiler treatment

### Motion

- 140–220ms for direct interactions
- 250–400ms for panels and route transitions
- Use opacity, subtle translation, and progress interpolation
- Avoid constant ambient animation
- Fully respect `prefers-reduced-motion`

### Iconography and imagery

- Use one consistent outline icon family
- Posters/backdrops come from licensed metadata providers
- Avoid decorative AI imagery inside the product UI
- Use content imagery purposefully; analytics and admin pages should rely on typography and visualization

## 4. Experience Architecture

### Navigation model

Desktop uses a persistent left rail and a compact global header. Mobile uses a five-item bottom navigation plus a More menu.

Primary destinations:

1. Home
2. Discover
3. Search
4. Library
5. Continue Watching

Secondary destinations:

- Planner
- Calendar/Releases
- Recommendations
- Stats/DNA
- Community
- Profile and Settings

### Page layout families

- **Marketing:** public landing, features, help, legal
- **Workspace:** home, discover, library, history, planner, stats
- **Media detail:** cinematic hero followed by structured metadata and personal actions
- **Community:** feed, reviews, lists, profiles
- **Administration:** separate dense, utilitarian shell with no cinematic hero treatment

### First viewport priorities

- Home: Continue Watching and one primary recommendation
- Discover: filters and immediately useful results
- Library: status tabs, search, filters, and content grid/list
- Media detail: identity, essential metadata, progress/status actions, rating
- Planner: available-time control and generated options
- Stats: meaningful summary and time-range control

### Responsive behavior

- Mobile: one-handed tracking actions, bottom navigation, sheets for filters
- Tablet: two-column content surfaces and collapsible navigation
- Desktop: persistent rail, multi-column dashboards, contextual side panels
- Wide desktop: constrain reading widths; do not stretch metadata across the screen

### Required states for every data surface

Loading skeleton, first-use empty state, filtered-empty state, recoverable error, offline/network error, success feedback, and permission/privacy state.

## 5. Information Architecture and Initial Routes

Release 1 route groups:

```text
Public
  /
  /login
  /register
  /forgot-password
  /reset-password
  /verify-email

Personal
  /onboarding
  /home
  /discover
  /search
  /library
  /continue
  /history
  /recommendations
  /planner
  /dna
  /settings/*

Media
  /movie/:id
  /tv/:id
  /tv/:id/season/:seasonNumber
  /tv/:id/season/:seasonNumber/episode/:episodeNumber
  /anime/:id
```

Routes for community, admin, achievements, groups, Wrapped, people, characters, studios, and franchises should be registered only when their delivery phase begins.

## 6. Technical Architecture

### Initial architecture: modular monolith

Use one React application and one Node.js/Express/TypeScript backend organized by domain, with Prisma for PostgreSQL access. Do not begin with microservices. Heavy and scheduled work runs through Node.js workers that share domain code and database contracts with the API. Python is reserved for optional, later ML services.

```text
React + TypeScript + Vite
          │ HTTPS / JSON
          ▼
Node.js/Express modular monolith
  ├─ Identity and access
  ├─ Catalog aggregation
  ├─ Tracking and library
  ├─ Ratings and history
  ├─ Recommendations and DNA
  ├─ Discovery and search
  └─ Releases and notifications
          │
    ┌─────┼─────────────┐
    ▼     ▼             ▼
PostgreSQL Redis   Background workers
                         │
                         ▼
                 External metadata APIs
```

### Frontend boundaries

```text
src/
  app/             routing, providers, app shell
  features/        domain-oriented UI and behavior
  entities/        reusable media/user/domain presentations
  components/      shared interface primitives
  services/        typed API client and external adapters
  stores/          minimal client-only state
  styles/          tokens and global styles
  test/            shared test utilities
```

Rules:

- Server data lives in a query cache, not duplicated global stores.
- URL parameters own shareable search/filter state.
- Local component state owns transient interaction state.
- Generated API types should prevent frontend/backend contract drift.
- Feature folders may use shared entities; unrelated features should not import each other's internals.

Recommended frontend foundations:

- React Router
- TanStack Query for server state
- React Hook Form plus schema validation
- A small accessible primitive layer, themed through Scenic tokens
- Vitest and Testing Library
- Playwright for critical journeys

### Backend boundaries

```text
backend/
  src/
    index.ts        server entry point and route mounting
    modules/        domain routes, validation, services, repositories
    integrations/   metadata, streaming, email, push providers
    jobs/           scheduled and queue-driven tasks
    config/         environment, security, telemetry, Prisma client
  prisma/
    schema.prisma   database schema
    migrations/     versioned database changes
  tests/
```

Each domain owns its models, schemas, repository/query layer, service rules, and tests. API routes call application services rather than embedding business logic.

Recommended backend foundations:

- Node.js, Express, and TypeScript
- Runtime request/response validation with a TypeScript schema library
- Prisma ORM and Prisma Migrate
- PostgreSQL
- Redis for rate limits, caching, locks, and queue coordination
- A Node.js worker/queue system selected during implementation spike
- Vitest or another Node.js test runner, contract tests, and integration tests against PostgreSQL

### API style

- Versioned REST API under `/api/v1`
- Resource-oriented endpoints and consistent pagination
- Cursor pagination for feeds/history; page pagination where stable navigation matters
- Idempotency keys for watch logging and other retry-prone mutations
- Optimistic concurrency or version checks for progress updates
- Standard problem-details error envelope
- An OpenAPI specification for the Express API is the contract source for generated client types
- WebSockets or server-sent events only when a demonstrated real-time use case appears

## 7. Data Architecture

### Canonical media strategy

Use a shared `media` identity for cross-cutting behavior and subtype tables for domain-specific fields.

Conceptual model:

```text
media
  id, media_type, canonical_title, original_title,
  release_year, status, synopsis, runtime, poster, backdrop

movie_details        tv_details          anime_details
season               episode             media_relationship
external_reference   genre               media_genre
person               credit              studio/company
```

Anime relations, franchises, collections, sequels, prequels, and alternate versions should use a typed `media_relationship` model rather than subtype-specific foreign-key columns.

### User-owned data

Keep the following independent from provider metadata:

- `user_media_state`: status, favorite, progress summary, dates
- `watch_event`: append-oriented viewing diary records
- `episode_progress`: current materialized episode state
- `rating`: canonical internal numeric score
- `recommendation_feedback`
- `user_preference`
- `entertainment_dna_snapshot`

Watch events should be the historical truth; progress and aggregate statistics are derived/materialized views that can be rebuilt.

### External identity

Every catalog entity may have multiple provider references:

```text
external_reference
  entity_type
  entity_id
  provider
  external_id
  fetched_at
  data_version
```

Never use a provider's identifier as Scenic's primary key.

### Database principles

- UUID or time-sortable UUID primary keys for Scenic-owned records
- UTC timestamps; preserve the user's timezone for diary/calendar presentation
- Soft deletion only where recovery, moderation, or audit requirements justify it
- Explicit uniqueness constraints for idempotent tracking
- JSONB for provider payload fragments or truly variable metadata, not core relationships
- Index from real query plans and access patterns, not speculation
- Audit security- and moderation-sensitive actions

## 8. Recommendation and DNA Architecture

### Stage 1 scoring model

Begin with a transparent weighted score:

```text
candidate score =
  genre affinity
  + theme/keyword affinity
  + people/studio affinity
  + runtime fit
  + language/country affinity
  + quality confidence
  + exploration bonus
  - already-seen penalty
  - negative-feedback penalty
  - unavailable-content penalty
```

Store the component scores so the UI can generate truthful explanations. “Taste Match” must be calibrated before it is displayed as a percentage; until then, use labels such as Strong Match or Exploratory Pick.

### Entertainment DNA model

Track separate signals for:

- Consumption affinity
- Positive rating affinity
- Completion affinity
- Negative/drop affinity
- Emerging interest
- Confidence based on sample size and recency

Create versioned snapshots rather than overwriting the profile. This enables taste evolution and reproducible recommendation explanations.

### Feedback loop

Accepted signals include explicit rating, completion, rewatch, drop, More Like This, Less Like This, Not Interested, hidden title/genre, planner selection, and recommendation dismissal.

Implicit signals should be used conservatively; a card impression is not evidence of dislike.

## 9. Spoiler-Safety Architecture

Spoiler protection is a domain capability, not only CSS blur.

Maintain a progress boundary for each episodic work. Community items, review sections, notification copy, and future AI requests attach a spoiler scope such as series, season, or episode. The response layer compares content scope with user progress before returning or revealing it.

Release 1 must include:

- Explicit spoiler flags
- Season/episode spoiler scope
- User progress boundary
- Blurred/hidden presentation
- Safe defaults when scope is unknown

## 10. Security and Privacy Baseline

- Argon2id password hashing
- Secure, HTTP-only, same-site cookies
- Short-lived access session plus rotating refresh/session mechanism
- Email verification and secure password reset
- CSRF protection where cookie authentication requires it
- Rate limits for authentication, search, review, and write endpoints
- Session/device listing and revocation
- Role- and permission-based admin authorization
- Schema validation at every trust boundary
- Privacy checks inside queries/services, not only UI hiding
- Secrets exclusively in environment/secret storage
- Structured audit trail for sign-in, account, moderation, and admin actions
- Dependency, static analysis, and secret scanning in CI

Two-factor authentication and recovery codes may ship after the basic identity flow, but the data model and session architecture must not prevent them.

## 11. Caching, Jobs, and Search

### Cache layers

- Browser/CDN: public static assets and safely cacheable catalog responses
- Query cache: client-side server state
- Redis: provider responses, hot catalog objects, rate limits, locks
- PostgreSQL: Scenic records and durable cached catalog data

Every cache entry needs a TTL and invalidation owner. User-private responses must never enter a shared public cache.

### Background jobs

- Metadata refresh
- Episode and release synchronization
- Recommendation generation
- DNA/statistics aggregation
- Notification scheduling and delivery
- Import processing
- Achievement evaluation
- Wrapped generation

Jobs must be retryable, idempotent, observable, and protected from duplicate execution.

### Search progression

1. PostgreSQL full-text and trigram search
2. Add a dedicated search engine only after scale/relevance measurements justify it
3. Keep the search interface provider-agnostic so the backend can evolve

## 12. Quality and Delivery Workflow

### Environments

- Local development
- Preview/staging with seeded, non-sensitive data
- Production

### CI gates

- Formatting and linting
- Type checking
- Unit tests
- Backend integration tests
- Database migration validation
- Frontend production build
- Critical end-to-end journeys
- Security and dependency checks

### Critical Release 1 journeys

1. Register → verify → onboard → receive recommendations
2. Search → open title → add to library → rate
3. Start series → +1 episode → Continue Watching updates
4. Correct an accidental watch event → progress and stats reconcile
5. Recommendation feedback → subsequent recommendations update
6. Private profile/data remains inaccessible to another account

### Observability

- Structured logs with request/job correlation IDs
- Error tracking for frontend, API, and workers
- API latency/error metrics
- Queue depth and failed-job metrics
- Provider quota, latency, and failure monitoring
- Recommendation acceptance and feedback metrics

## 13. Delivery Milestones

### Milestone 0 — Decisions and spikes

- Confirm metadata providers and usage terms
- Prototype cross-provider identity matching
- Validate anime relationship and episode coverage
- Decide authentication/session approach
- Benchmark the worker/queue choice
- Produce low-fidelity flows and design tokens
- Record architecture decisions

Exit condition: major external dependencies and irreversible architecture choices are understood.

### Milestone 1 — Foundation

App shells, design system, authentication, migrations, API contract, test harness, CI, and observability baseline.

### Milestone 2 — Catalog and search

Metadata adapters, caching, unified media model, search, movie/TV/anime detail pages.

### Milestone 3 — Tracking

Library state, watch events, episode progress, Continue Watching, ratings, and history.

### Milestone 4 — Personalization

Onboarding, personalized home, DNA v1, content recommendations, explanations, and feedback.

### Milestone 5 — Planner and release readiness

Smart Planner, accessibility audit, privacy/security review, performance checks, operational runbooks, and production launch.

Every milestone follows:

`Define → design → migrate → implement → test → review → document → stable checkpoint`

## 14. Decisions Required Before Coding

These should be recorded as short Architecture Decision Records (ADRs):

1. Metadata providers for movie/TV, anime, and streaming availability
2. Cross-provider canonical identity and deduplication policy
3. Anime season/cour/special representation
4. Authentication/session and OAuth implementation
5. Background queue/worker technology
6. Image proxying and caching policy
7. Rating input formats and canonical stored scale
8. Recommendation-score calibration and explanation format
9. Deployment platform and managed PostgreSQL/Redis providers
10. Privacy defaults and minimum supported account age/country rules

## 15. Definition of Ready for Implementation

Coding begins after the following are agreed:

- Release 1 scope and explicit non-goals
- Primary personas and five critical user journeys
- Sitemap and navigation model
- Low-fidelity wireframes for onboarding, home, search, details, library, Continue Watching, DNA, and planner
- Visual tokens and component conventions
- Provider feasibility results
- Initial domain model and API conventions
- Authentication, privacy, and spoiler-safety strategy
- Test strategy and milestone acceptance criteria
- Local, staging, and production environment plan

## 16. Recommended Immediate Next Steps

1. Convert Release 1 into user stories with acceptance criteria.
2. Create low-fidelity wireframes for the eight core surfaces.
3. Run metadata-provider and anime-model technical spikes.
4. Write ADRs for identity, media modeling, authentication, jobs, and deployment.
5. Build the design-token sheet and a small interactive component gallery.
6. Only then scaffold the stable frontend/backend foundation.
