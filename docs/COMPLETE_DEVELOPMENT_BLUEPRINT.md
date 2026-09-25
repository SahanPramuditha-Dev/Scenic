Scenic — Complete Development Blueprint
Scenic — Entertainment Intelligence
“Everything you watch. One intelligent place.”

Scenic is not another Netflix-like streaming service. It is a Personal Entertainment Operating System for movies, TV series, and anime.
Its purpose is to answer three questions exceptionally well:
What have I watched? → What do I actually like? → What should I watch next?
The long-term product idea is:
Scenic remembers what you watch, learns what you love, and helps decide what fits next.

1. Product Vision
Most entertainment applications solve only one part of the problem.
TMDB → information
IMDb → information + ratings
Letterboxd → movie logging/social
Trakt → tracking
AniList/MyAnimeList → anime
Streaming services → content they own
JustWatch → availability
Scenic should combine the useful parts while focusing on personal entertainment intelligence.
The core system becomes:
                     SCENIC
                       │
         ┌─────────────┼─────────────┐
         │             │             │
      MEMORY          TASTE       DECISION
         │             │             │
   What did you    What do you    What should
      watch?         enjoy?       you watch now?

These become Scenic's three main intelligence pillars.
2. Product Scope
Scenic supports:
- Movies
- TV series
- Anime
- Seasons
- Episodes
- Streaming availability
- Personal ratings
- Watch history
- Watchlists
- Favorites
- Custom lists
- Recommendations
- Entertainment statistics
- Taste analysis
- Smart queues
- Decision assistance
- Upcoming releases
- Notifications
- Import/export
Scenic does not host or stream copyrighted content.
It tells users:
WHAT exists
WHAT they watched
WHERE something is available
WHAT they might like
WHY it suits them
WHAT they should watch next

3. Main User Experience
The ideal flow is:
Landing Page
     ↓
Register / Login
     ↓
Onboarding
     ↓
Select favorite movies / shows / anime
     ↓
Scenic builds initial Taste Profile
     ↓
Home Dashboard
     ↓
Discover / Search
     ↓
Media Details
     ↓
Add to Watchlist / Start Watching / Rate
     ↓
Scenic records Entertainment Memory
     ↓
Taste Profile becomes smarter
     ↓
Decision Engine improves

The platform gets progressively more useful the more the person uses it.
4. Technology Stack
This follows the architecture we previously selected.
Frontend
React
TypeScript
Vite
Tailwind CSS
React Router

Recommended supporting libraries:
TanStack Query
Zustand
React Hook Form
Zod
Framer Motion
Lucide Icons
Recharts

Why TanStack Query?
Server data such as:
movies
TV shows
anime
watchlists
ratings
history
recommendations

should not be manually managed in React state.
TanStack Query handles:
fetching
caching
refetching
loading states
errors
optimistic updates
pagination

5. Backend
Use:
Node.js
Express with TypeScript
Runtime request validation
Prisma ORM
PostgreSQL

The existing Scenic backend uses Node.js, Express, TypeScript, Prisma, and PostgreSQL.
Architecture:
React Application
        │
        │ HTTPS REST API
        ▼
     Express API
        │
 ┌──────┼──────────┐
 │      │          │
 ▼      ▼          ▼
Postgres Cache  External APIs
                    │
          ┌─────────┼──────────┐
          │         │          │
        Movies      TV        Anime

6. Authentication
Use:
Firebase Authentication
Initially support:
Google Sign-In
Email + Password

Frontend receives Firebase token.
User logs in
     ↓
Firebase Authentication
     ↓
Firebase ID Token
     ↓
React sends token to Express API
     ↓
Express API verifies token
     ↓
Express API identifies Scenic user

Do not use Firebase as Scenic's main database.
Use:
Firebase → Identity
PostgreSQL → Application Data

7. Deployment Architecture
Initial architecture:
                   Internet
                       │
             ┌─────────┴─────────┐
             │                   │
      Cloudflare Pages           VPS
             │                   │
         Scenic Web           Express API
                                 │
                              PostgreSQL
                                 │
                        External APIs

Later:
                     VPS
                      │
                     K3s
                      │
                Traefik Ingress
                      │
        ┌─────────────┼─────────────┐
        │             │             │
    API Pods       Workers      PostgreSQL

You can therefore build normally first and learn Kubernetes later rather than introducing K3s before the application itself works.
8. Main Navigation
Logged-in desktop sidebar:
SCENIC

⌂  Home

⌕  Discover
   ├ Movies
   ├ TV Series
   └ Anime

▣  Library
★  Watchlist
◷  History
☷  Lists

────────────

◈ Entertainment DNA
✦ For You
◎ Statistics

────────────

⚙ Settings

The exact navigation should remain relatively small.
Advanced functionality should live inside pages instead of creating 20 sidebar links.
9. Global Header
Every authenticated page gets:
┌──────────────────────────────────────────────┐
│ Search Scenic...             🔔    Avatar   │
└──────────────────────────────────────────────┘

Universal search should support:
Movies
TV
Anime
People
Lists later

Search shortcut:
Ctrl + K

Opening it gives a command-palette style interface.
10. Public Landing Page
Route:
/

Only unauthenticated users get the marketing landing page.
Sections:
Hero
SCENIC

Everything you watch.
One intelligent place.

Discover, track and understand the
entertainment you love.

[ Start Exploring ] [ See How It Works ]

Use cinematic background artwork/posters.
Popular Now
Cards for:
Movies
Series
Anime

Feature Explanation
Show:
Discover
Track
Understand
Decide

Entertainment Memory
Explain that Scenic remembers:
movies watched
episodes watched
ratings
rewatches
favorites
watch dates
progress

Entertainment DNA
Visual demonstration.
For example:
Your Entertainment DNA

Sci-Fi           █████████ 91%
Drama            ████████  82%
Mystery          ███████   74%
Thriller         ██████    68%

Preferred runtime: 40–60 min
Favorite decade: 2010s
Preferred pacing: Medium

Decision Engine
Example:
What are you in the mood for?

Time available
○ 20 min
○ 45 min
● 2 hours
○ Anything

Mood
[ Relaxed ] [ Intense ] [ Funny ]

Watching
[ Alone ]

Scenic recommends:

Dune: Part Two

92% Match

Statistics
Preview Year in Review.
Final CTA
Stop searching.
Start watching.

[ Create your Scenic profile ]

11. Authentication Pages
Routes:
/login
/register
/forgot-password

Design them minimally.
Example:
             SCENIC

      Welcome back.

      [ Continue with Google ]

              OR

      Email
      ─────────────

      Password
      ─────────────

      [ Sign In ]

      New to Scenic?
      Create an account

12. Onboarding
Route:
/onboarding

Do not immediately throw new users into an empty dashboard.
Step 1 — Welcome
Let's build your Scenic profile.

Step 2 — Entertainment Types
What do you watch?

☑ Movies
☑ TV
☑ Anime

Step 3 — Favorite Genres
Action
Drama
Comedy
Sci-Fi
Fantasy
Mystery
Thriller
Romance
Horror
Animation
...

Step 4 — Select Titles
Ask:
Which of these have you enjoyed?

Display ~20–30 popular titles.
Interaction:
❤️ Loved it
👍 Liked it
😐 Okay
👎 Didn't like it

This gives Scenic better initial recommendation data than asking for genres alone.
Step 5 — Streaming Services
Example:
Netflix
Prime Video
Disney+
Crunchyroll
Apple TV+
Others

Users can skip.
Step 6 — Profile Ready
Your Entertainment DNA is starting to form.

[ Enter Scenic ]

13. Home Dashboard
Route:
/home

This must be the most personalized page in Scenic.
Example layout:
Good evening, Sahan.

What are we watching today?

[ Search movies, shows and anime... ]

────────────────────────────

CONTINUE WATCHING

[Poster] [Poster] [Poster] [Poster]

────────────────────────────

UP NEXT

Attack on Titan
S04 E18

[ Mark Watched ]

────────────────────────────

SCENIC PICK

Dune: Part Two

92% match

Because you enjoyed:
Blade Runner 2049
Arrival

[ Why this? ] [ Watchlist ]

────────────────────────────

YOUR WEEK

6 episodes
2 movies
8h 42m

────────────────────────────

WATCHLIST PICKS

────────────────────────────

ENTERTAINMENT DNA

Sci-Fi  █████████
Drama   ████████
Anime   ███████

────────────────────────────

TRENDING FOR YOU

────────────────────────────

UPCOMING

────────────────────────────

RECENTLY WATCHED

14. Continue Watching
One of Scenic's most important components.
Each card shows:
Poster

Breaking Bad

S03 E07
42% season progress

████████░░░

[ Continue ]

Movies can display:
Started 34 minutes ago

if playback integration becomes possible later.
Initially Scenic tracks manually logged progress.
15. Up Next System
For episodic content:
Series
        ↓
Last Watched Episode
        ↓
Calculate next episode
        ↓
Show in Up Next

Example:
Attack on Titan

Last watched
S04 E16

Up Next
S04 E17
Judgment

[ Mark Watched ]

16. Discover Page
Route:
/discover

Top interface:
Discover

[ Movies ] [ TV ] [ Anime ]

Genres
[ Action ] [ Drama ] [ Sci-Fi ] ...

Sort
Trending ▼

Year
2020–2026 ▼

Rating
7+ ▼

Runtime
Any ▼

Streaming On
Netflix ▼

Sections can include:
Trending Today
Popular This Week
Top Rated
New Releases
Hidden Gems
Because You Watched...
From Your Favorite Genres
Short Watches
Long Weekend Watches
Highly Rated Anime

17. Browse Pages
Routes:
/movies
/tv
/anime

Each gets type-specific filtering.
Movies:
Genre
Year
Runtime
Rating
Language
Country
Provider

TV:
Genre
Status
Seasons
Episodes
Year
Provider

Anime:
Genre
Season
Year
Format
Episodes
Status
Studio

18. Universal Search
Route:
/search?q=

Search page:
Search Scenic

"dune"

ALL | MOVIES | TV | ANIME | PEOPLE

Movies
────────────────

Dune
Dune: Part Two
Dune (1984)

TV
────────────────

Dune: Prophecy

Add:
Recent searches
Trending searches
Search suggestions

19. Media Details Page
Routes:
/movie/:id
/tv/:id
/anime/:id

This is another major Scenic screen.
Example:
────────────────────────────────

            BACKDROP

          DUNE: PART TWO

2024 • 2h 46m • Sci-Fi • PG-13

TMDB 8.5     Scenic 8.8

[ + Watchlist ]
[ ✓ Watched ]
[ ★ Rate ]
[ ⋯ ]

────────────────────────────────

OVERVIEW

Paul Atreides unites...

────────────────────────────────

YOUR SCENIC

92% Taste Match

Why:
• Strong sci-fi preference
• You loved Arrival
• You rated Dune 9/10

────────────────────────────────

WHERE TO WATCH

Netflix
Prime Video

────────────────────────────────

CAST

────────────────────────────────

TRAILER

────────────────────────────────

RELATED

────────────────────────────────

REVIEWS

────────────────────────────────

20. User Media State
Every piece of media can have a personal state.
NONE
WATCHLIST
WATCHING
COMPLETED
PAUSED
DROPPED

Movies mainly need:
WATCHLIST
COMPLETED

TV/anime need full state support.
21. Rating System
Use:
1–10

Allow half points later if desired.
Initially:
1
2
3
...
10

Optional text:
Quick note

Example:
Your rating

9 / 10

Beautiful cinematography and world building.

Ratings directly feed the Taste Engine.
22. Favorites
Favorite is different from rating.
A person may rate something:
8/10

but still consider it a personal favorite.
Therefore maintain:
rating
favorite

independently.
23. Library
Route:
/library

Tabs:
All
Movies
TV
Anime
Watching
Completed
Paused
Dropped
Favorites

Search + filter:
Search library...

Genre
Rating
Year
Status
Date Added
Date Watched

Views:
Grid
Compact Grid
List

24. Watchlist
Route:
/watchlist

Do NOT make it just another poster grid.
This becomes the basis for the Smart Queue.
Traditional mode:
My Watchlist

182 titles

Smart mode:
Recommended Order

1. Dune: Part Two
   92% fit
   
   Why now?
   • Fits your current sci-fi preference
   • Available on your subscription
   • High similarity to Arrival

2. Dark
3. Severance

Users may switch:
Manual
Smart

25. Smart Queue
Eventually allow rules.
Example:
My Weekend Queue

Max runtime:
2 hours

Preferred:
Movies

Mood:
Relaxed

Providers:
Netflix + Prime

Exclude:
Horror

Scenic automatically reorders candidates.
26. History
Route:
/history

Timeline:
TODAY

Attack on Titan
S04 E13
8:13 PM

Breaking Bad
S02 E03
5:20 PM

────────────────────

YESTERDAY

Dune
Movie
9:17 PM

Filters:
Movie
Episode
Anime
Date
Rating

27. Quick Log
Logging must be extremely fast.
Global button:
+ Log

Search:
What did you watch?

Select content.
Then:
✓ Watched
★ Rating
📅 Date

[ Save ]

For episodes:
Mark episode
Mark season
Mark all previous episodes

28. Undo System
Accidentally clicking "Mark season watched" should not destroy history.
Show:
12 episodes marked watched.

[ Undo ]

Important usability feature.
29. Custom Lists
Route:
/lists

Examples:
Best Sci-Fi Ever
Comfort Movies
Weekend Anime
Watch With Friends
2026 Movies
Oscar Winners

Model:
List

name
description
visibility
items
ordering
created_at
updated_at

Initially:
Private
Public later

30. Entertainment DNA
Route:
/dna

This is one of Scenic's signature features.
It should analyze things such as:
Genre preferences
Subgenre preferences
Movie vs TV vs Anime
Runtime preference
Decade preference
Language distribution
Country distribution
Favorite directors
Favorite actors
Favorite studios
Average rating
Completion behavior
Dropping behavior
Rewatch tendencies
Viewing time
Binge behavior
Mood preferences later

Example UI:
YOUR ENTERTAINMENT DNA

PRIMARY TASTE

Sci-Fi       94
Drama        88
Mystery      83
Thriller     74
Fantasy      69

──────────────────────

YOUR STYLE

Complex Stories      High
Slow Burn            Medium
Dark Tone            High
Comedy                Low
World Building       Very High

──────────────────────

FORMATS

Movies      42%
TV          38%
Anime       20%

──────────────────────

WATCHING PERSONALITY

"The World Explorer"

You gravitate toward immersive stories,
complex worlds and mystery-driven narratives.

Avoid pretending these are scientific personality assessments. They're entertainment-profile summaries derived from viewing behavior.
31. Taste Graph
Internally represent preferences.
Conceptually:
User
 │
 ├── likes → Sci-Fi
 ├── strongly likes → Mystery
 ├── likes → Christopher Nolan
 ├── likes → Denis Villeneuve
 ├── likes → Psychological
 ├── dislikes → Slasher Horror
 └── prefers → 2010–2026

The recommendation system evaluates candidate titles against this profile.
32. Context vs Dislike
This is important.
Suppose somebody drops a show.
Do not automatically conclude:
User hates this genre.

Ask:
Why did you stop watching?

○ Didn't enjoy it
○ Not in the mood
○ Too long
○ Lost access
○ Watching later
○ Other

Only:
Didn't enjoy it

should strongly affect taste.
This makes Scenic's recommendation model better.
33. Decision Engine
Route:
/decide

This could eventually become Scenic's strongest differentiator.
User starts with:
What should I watch?

Scenic asks only relevant context.
Time
< 30 min
30–60 min
1–2 hours
2+ hours
Any

Mood
Relaxed
Funny
Emotional
Intense
Exciting
Thoughtful
Scary
Surprise me

Commitment
Quick Watch
Movie Tonight
Start a Series
Continue Something

Who
Alone
Partner
Friends
Family

Source
My Watchlist
My Services
Anything

Then:
SCENIC PICK

INTERSTELLAR

95% fit

Why this works now

✓ Matches your sci-fi taste
✓ Fits tonight's available time
✓ Similar to Arrival, which you rated 9
✓ Available on a selected service

[ Watch This ]

Alternative Picks

Arrival
Dune
Blade Runner 2049

34. Recommendation Explanation
Never just write:
93% Match

Explain it.
Example:
WHY SCENIC PICKED THIS

You frequently rate:
Sci-Fi          8.7
Mystery         8.5

You loved:
Arrival
Interstellar

This title shares:
✓ director
✓ themes
✓ genres
✓ pacing

Explainable recommendations build trust.
35. Recommendation Architecture
Do not begin with an expensive LLM.
Start with deterministic recommendation scoring.
Example:
RecommendationScore =

genre_match          × 0.25
rating_similarity    × 0.20
keyword_match        × 0.15
person_match         × 0.10
popularity_quality   × 0.10
watchlist_priority   × 0.10
context_match        × 0.10

Later introduce embeddings/ML.
36. Recommendation Evolution
V1
Rule based.
Genres
Ratings
Popularity
History
Watchlist

V2
Content similarity.
genres
keywords
cast
director
studio
themes

V3
Vector-based Taste Model.
User Vector

         compare

Content Vector

V4
Collaborative signals.
People with similar tastes liked...

V5
Hybrid Scenic ranking.
Content similarity
+
Taste graph
+
Context
+
History
+
Collaborative data
+
Availability

37. AI Usage
AI should enhance Scenic, not run the entire application.
Good uses:
Natural language discovery

"Find a dark sci-fi movie under two
hours that isn't too depressing."

Entertainment DNA summaries

Recommendation explanations

Year-review summaries

List generation

Semantic search

Do not make every recommendation an LLM request.
That would make Scenic:
expensive
slow
unpredictable
hard to scale

Meter AI features.
38. Ask Scenic
Later provide:
Ask Scenic ✦

Queries:
Give me something like Dark but shorter.

What anime should I start this weekend?

Which movie on my watchlist fits tonight?

What should I finish before starting something new?

Find me a 90-minute thriller.

39. Spoiler Protection
A major Scenic feature.
Scenic knows:
User watched:
S1 E1–E7

Not watched:
S1 E8+

Therefore:
Hide episode thumbnails
Hide descriptions
Hide comments
Hide character information

beyond progress.
Example:
S01 E08

🔒 Description hidden because you
haven't reached this episode.

[ Reveal Spoilers ]

40. Progress-Aware Information
Eventually even character pages can respect progress.
Instead of showing:
Character dies in S4

the application knows:
User currently on S2

and hides information involving later events.
This is a powerful long-term Scenic differentiator.
41. Statistics
Route:
/stats

Dashboard:
TOTAL WATCHED

Movies               286
TV Episodes         1842
Anime Episodes       923

WATCH TIME

Movies               528h
TV                   947h
Anime                381h

Total               1856h

Charts:
Watching by Month
Genres
Ratings
Years
Languages
Countries
Providers
Weekdays
Formats

42. Year in Review / Scenic Wrapped
Route:
/wrapped/2026

Shareable experience:
YOUR 2026
WITH SCENIC

102 Movies

683 Episodes

Your #1 Genre
SCI-FI

Most Watched Actor
...

Favorite Show
...

Longest Binge
...

Total Watch Time
472 Hours

Your Entertainment Personality
THE EXPLORER

Generate visually attractive cards users can share.
This can help Scenic grow organically.
43. Release Calendar
Route:
/calendar

Views:
Calendar
Timeline

Events:
New movie
Season premiere
Episode
Anime episode
Streaming release

Personalization:
Following
Watchlisted
Trending
All

44. Notifications
Notification types:
New episode
New season
Movie released
Streaming availability changed
Watchlist title becomes available
Recommendation
Upcoming release
Year review

Notification center:
/notifications

Example:
Severance S03 E01 releases tomorrow.

Dune: Part Two is now available
on a service you selected.

45. Profiles
Route:
/profile

Profile:
Avatar
Display name
Username

Entertainment DNA preview

Favorite Movies
Favorite Shows
Favorite Anime

Statistics

Public Lists

Privacy controls:
Private
Friends only later
Public

Default toward privacy.
46. Social Features
Do not build Scenic as another large social network initially.
Later support small-circle sharing.
Potential features:
Follow friends
Share lists
Recommend directly
See friend activity
Compare taste
Group watchlist
Watch together planning

Example:
You & Alex

Taste Similarity
82%

Both loved

Interstellar
Dark
Dune

This belongs well after the personal product works.
47. Subscription Intelligence
Users select subscriptions:
Netflix
Prime Video
Disney+
etc.

Scenic can then calculate:
61% of your watchlist is currently
available on your subscriptions.

Eventually:
Netflix

Watchlist titles     26
Watching             4
Finished this month  8
Usage                High

Scenic should avoid giving financial advice; simply provide usage/availability information.
48. Settings
Route:
/settings

Sections:
Account
Profile
Appearance
Privacy
Notifications
Streaming Services
Spoilers
Data
AI
Integrations
Security
About

49. Data Portability
Very important for user trust.
Settings → Data:
Export My Scenic Data
Import Data
Delete Account

Export formats:
JSON
CSV

Potential imports later:
Letterboxd
Trakt
IMDb
AniList
MyAnimeList

Use resumable background import jobs for large histories.
50. Core Database Model
Recommended database groups:
USERS
ENTERTAINMENT CATALOG
USER ACTIVITY
LISTS
TASTE
RECOMMENDATIONS
PROVIDERS
NOTIFICATIONS
SYSTEM

51. Users Table
users

id                  UUID PK
firebase_uid        VARCHAR UNIQUE
username            VARCHAR UNIQUE
display_name
email
avatar_url

country_code
timezone

onboarding_complete BOOLEAN

created_at
updated_at
last_seen_at

52. Media Table
Do not create completely isolated movie/TV/anime systems.
Create a canonical media model.
media

id
media_type

title
original_title

overview

release_date

poster_url
backdrop_url

runtime

original_language

status

adult

popularity

external_rating

created_at
updated_at

media_type:
MOVIE
TV
ANIME

53. External IDs
Critical architecture decision.
media_external_ids

media_id

provider
provider_id

Example:
42 | TMDB   | 27205
42 | IMDB   | tt1375666
42 | TVDB   | ...

Do not make TMDB IDs Scenic's own primary keys.
Scenic owns its own canonical IDs.
That allows providers to change later.
54. Genres
genres

id
name
slug

Mapping:
media_genres

media_id
genre_id

55. People
people

id
name
photo_url
birth_date

Credits:
media_credits

media_id
person_id

credit_type

character_name
job
department
order_number

56. Series Structure
seasons

id
media_id
season_number
name
overview
poster_url
episode_count
release_date

Episodes:
episodes

id
season_id
episode_number

title
overview
runtime
air_date
still_url

57. User Media Table
Very important.
user_media

id
user_id
media_id

status

rating
favorite

started_at
completed_at

last_interaction_at

created_at
updated_at

Possible statuses:
WATCHLIST
WATCHING
COMPLETED
PAUSED
DROPPED

58. Watch Events
Do not store only:
watched = true

Store events.
watch_events

id

user_id
media_id
episode_id

event_type

watched_at

progress_seconds
duration_seconds

source

created_at

Possible events:
WATCHED
REWATCHED
STARTED
PROGRESS
COMPLETED

This preserves entertainment history properly.
59. Ratings
Potential separate table:
ratings

id
user_id
media_id
episode_id

score
review

created_at
updated_at

Allows episode ratings later.
60. Watchlist
You can either represent basic watchlist through user_media or create a dedicated model for advanced queue functionality.
For Smart Queue, dedicated metadata is useful:
watchlist_items

id
user_id
media_id

priority
manual_order

added_at

reason

61. Lists
lists

id
user_id

name
description

visibility

created_at
updated_at

list_items

list_id
media_id

position
note

added_at

62. Streaming Providers
providers

id
name
logo_url
website

Availability:
media_availability

media_id
provider_id
country_code

availability_type

url

last_checked_at

Types:
STREAM
RENT
BUY
FREE

63. User Providers
user_providers

user_id
provider_id

Then Scenic can filter recommendations according to services the user actually has.
64. Taste Profile
Derived data:
user_taste_profiles

user_id

version

vector

generated_at

Individual signals:
user_taste_signals

user_id

signal_type
signal_key

weight

evidence_count

updated_at

Example:
GENRE | science-fiction | 0.91
GENRE | drama           | 0.78
PERSON | 123            | 0.72
KEYWORD | time-travel   | 0.84

65. Recommendation Table
recommendations

id
user_id
media_id

score

reason_data

algorithm_version

generated_at
expires_at

Store recommendation explanations as structured data, not only text.
Example:
{
  "genre_match": 0.92,
  "similar_titles": [123, 456],
  "favorite_director": true
}

Frontend can generate explanations from it.
66. Notifications
notifications

id
user_id

type

title
message

entity_type
entity_id

read_at

created_at

67. User Preferences
user_preferences

user_id

theme

spoiler_protection

adult_content

recommendation_personalization

notification_preferences

language

region

68. Database Relationship Overview
User
 │
 ├── UserMedia ───── Media
 │                    │
 │                    ├── Genres
 │                    ├── Credits ── People
 │                    ├── Seasons
 │                    │     │
 │                    │     └── Episodes
 │                    │
 │                    └── Availability
 │
 ├── WatchEvents
 │
 ├── Ratings
 │
 ├── Watchlist
 │
 ├── Lists
 │      └── ListItems
 │
 ├── TasteSignals
 │
 ├── Recommendations
 │
 ├── Providers
 │
 └── Notifications

69. Backend Modules
Keep the Express entry point small. Extend the existing Node.js/TypeScript project by domain:
backend/

    src/
        index.ts
        config/
            firebase.ts
            prisma.ts
        modules/
            auth/
            users/
            media/
            tracking/
            recommendations/
        integrations/
        jobs/

    prisma/
        schema.prisma
        migrations/

    tests/

Each module can add routes, validation, services, and repositories as its behavior grows. Use Prisma Migrate for schema changes.

You don't have to introduce every abstraction immediately. Add them as complexity appears.
70. Frontend Structure
Recommended:
src/

app/
    router.tsx
    providers.tsx

components/

    ui/
    layout/
    media/
    charts/
    feedback/

features/

    auth/
    search/
    discover/
    tracking/
    library/
    watchlist/
    history/
    lists/
    recommendations/
    taste/
    statistics/
    notifications/

pages/

    LandingPage.tsx
    LoginPage.tsx
    RegisterPage.tsx

    HomePage.tsx
    DiscoverPage.tsx
    SearchPage.tsx

    MoviePage.tsx
    TVPage.tsx
    AnimePage.tsx

    LibraryPage.tsx
    WatchlistPage.tsx
    HistoryPage.tsx

    ListsPage.tsx
    ListDetailsPage.tsx

    DecidePage.tsx
    DNAProfilePage.tsx
    StatisticsPage.tsx
    CalendarPage.tsx

    ProfilePage.tsx
    SettingsPage.tsx

hooks/

lib/

services/
    api.ts

stores/

types/

utils/

71. Core Reusable UI Components
Build these early.
AppShell
Sidebar
TopBar

MediaCard
MediaCarousel
MediaGrid
Poster
Backdrop

Rating
ProgressBar
StatusBadge

SearchBox
SearchDialog

GenreChip
FilterPanel
SortMenu

EmptyState
SkeletonCard
ErrorState

Modal
Drawer
Dropdown
Tabs
Tooltip

WatchButton
WatchlistButton
FavoriteButton
RatingDialog

EpisodeRow
SeasonSelector

StatCard
ChartCard

RecommendationCard
WhyRecommendedDialog

72. API Structure
Base:
/api/v1

Authentication:
GET /users/me
PUT /users/me
DELETE /users/me

Catalog:
GET /media/{id}
GET /media/{id}/credits
GET /media/{id}/related
GET /media/{id}/availability

Search:
GET /search?q=

Discover:
GET /discover
GET /trending

Tracking:
POST /media/{id}/status
POST /episodes/{id}/watched
DELETE /episodes/{id}/watched

Ratings:
POST /media/{id}/rating
PUT /media/{id}/rating
DELETE /media/{id}/rating

Watchlist:
GET /watchlist
POST /watchlist/{media_id}
DELETE /watchlist/{media_id}

History:
GET /history
POST /history
DELETE /history/{event_id}

Library:
GET /library

Lists:
GET /lists
POST /lists

GET /lists/{id}
PUT /lists/{id}
DELETE /lists/{id}

POST /lists/{id}/items
DELETE /lists/{id}/items/{media_id}

Recommendations:
GET /recommendations
GET /recommendations/{media_id}/reason

Decision Engine:
POST /decision

Statistics:
GET /statistics
GET /statistics/year/{year}

Entertainment DNA:
GET /taste-profile

73. External API Architecture
Never scatter external API calls throughout components.
Use adapters.
MediaProvider Interface

       │
       ├── TMDBAdapter
       ├── AnimeAdapter
       └── FutureProviderAdapter

Internally Scenic converts external formats into its own normalized models.
Example:
External Movie
       ↓
Provider Adapter
       ↓
Scenic Media
       ↓
Database

This prevents vendor lock-in.
74. Metadata Caching
Don't call external APIs every time a card loads.
Flow:
User requests movie
       ↓
Check Scenic DB/cache
       ↓
Found and fresh?
   YES → Return
   NO
       ↓
Fetch provider
       ↓
Normalize
       ↓
Cache
       ↓
Return

This dramatically reduces external API usage.
75. Background Jobs
Eventually use workers for:
metadata refresh
recommendation generation
availability refresh
notifications
statistics aggregation
imports
exports
taste profile rebuilding

Architecture:
Express API
   │
   ├── Immediate API requests
   │
   └── Job Queue
          │
          ▼
        Worker

You do not need this on day one.
76. Offline-Friendly Design
Especially useful for future mobile apps.
Cache:
Library
Watchlist
Recently viewed titles
Upcoming episodes
Profile

Allow offline actions like:
mark watched
rate
favorite
watchlist

Store temporarily and synchronize when connectivity returns.
77. Security
Minimum requirements:
Firebase token verification

Never trust frontend user IDs

Authorization on every user resource

Rate limiting

Request validation

SQL parameterization

Secrets via environment variables

CORS restrictions

HTTPS

Input sanitization

Secure logging

API key protection

Never expose external-provider API secrets in React.
They stay behind Express API.
78. Privacy
Because Scenic builds behavioral profiles, users need control.
Provide:
Disable personalization

Delete watch history

Delete ratings

Clear searches

Export account

Delete account

Taste analysis should be clearly presented as entertainment preferences rather than opaque personal profiling.
79. Performance
Important strategies:
Pagination
Lazy loading
Poster image optimization
Database indexes
Metadata caching
Recommendation caching
Precomputed statistics
Precomputed taste vectors
Query batching
React query caching

Important indexes:
user_id
media_id
firebase_uid
status
watched_at
created_at
provider_id
external_id

80. Search Performance
Search order:
User types
"dun"

        ↓

Debounce ~300 ms

        ↓

Local/recent suggestions

        ↓

Scenic database

        ↓

External catalog provider if required

Avoid issuing network requests on every keystroke.
81. Visual Design Language
Continue the existing Scenic aesthetic:
Dark + cinematic + minimal.
Think:
deep charcoal / black backgrounds

large cinematic artwork

soft gradients

glass-like overlays used sparingly

rounded cards

strong typography

poster-focused layouts

subtle motion

minimal borders

Avoid turning Scenic into a dashboard full of boxes.
Entertainment should remain visually dominant.
82. Media Card
Standard card:
╭──────────────────╮
│                  │
│      POSTER      │
│                  │
│                  │
├──────────────────┤
│ Interstellar     │
│ 2014 • Movie     │
│ ★ 8.7     95%    │
╰──────────────────╯

Hover:
[ + Watchlist ]

[ ✓ Watched ]

[ More ]

83. Responsive Design
Desktop:
Sidebar + Content

Tablet:
Collapsed sidebar

Mobile:
Bottom Navigation

Possible bottom navigation:
Home
Discover
Search
Library
Profile

Do not simply shrink the desktop sidebar onto mobile.
84. Loading States
Every primary page needs skeleton UI.
Example:
███
████████████

┌──────┐
│      │
│      │
└──────┘

┌──────┐
│      │
│      │
└──────┘

Do not show an empty blank screen while APIs load.
85. Empty States
Examples:
Watchlist:
Your watchlist is empty.

Save movies, shows and anime
you want to watch later.

[ Discover Something ]

History:
Nothing watched yet.

Once you begin tracking,
your entertainment history appears here.

These states are part of the product design, not an afterthought.
86. Error States
Provide:
Couldn't load recommendations.

[ Try Again ]

rather than console errors or endless spinners.
87. Accessibility
Include:
Keyboard navigation
Visible focus states
ARIA labels
Alt text
Contrast
Reduced-motion support
Screen-reader labels
Accessible modals

88. Testing Strategy
Backend
Use:
Vitest
Supertest

Test:
authentication
authorization
media retrieval
ratings
watch events
lists
recommendation calculations
statistics
invalid input

89. Frontend Testing
Use:
Vitest
React Testing Library

Later:
Playwright

Critical E2E journeys:
Register
Search movie
Open details
Add watchlist
Mark watched
Rate movie
View history
Remove watchlist
Create list

90. CI/CD
GitHub Actions pipeline:
Push / Pull Request
       ↓
Lint
       ↓
Type Check
       ↓
Unit Tests
       ↓
Build
       ↓
Backend Tests
       ↓
Docker Build
       ↓
Deploy

This also fits very well with the GitHub Actions skills you're currently developing.
91. Monitoring
Eventually collect:
API latency
5xx errors
database errors
external API failures
recommendation generation failures
background-job failures

Do not log:
Firebase tokens
Passwords
Authorization headers
private exported data

92. Monetization
Keep core Scenic genuinely useful for free.
Scenic Free
Search
Tracking
Library
History
Basic Watchlist
Ratings
Favorites
Basic statistics
Basic recommendations
Import/export

Scenic Plus
Possible later:
Advanced Entertainment DNA

Advanced Decision Engine

Smart Queue rules

Advanced statistics

AI search

AI recommendation explanations

Advanced filters

Long-term insights

Additional customization

Do not lock basic data portability behind Plus.
93. Development Phases
This is the order I recommend.
Phase 0 — Foundation
Build:
Repository structure
Frontend shell
Express API project
PostgreSQL
Environment configuration
API connection
Docker basics
Error handling

Result:
React ↔ Express API ↔ PostgreSQL

working correctly.
94. Phase 1 — Authentication
Build:
Firebase project
Google authentication
Email/password
Firebase token handling
Express API token verification
Users table
/users/me
Protected routes
Onboarding flag

Result:
Users can create and access Scenic accounts.
95. Phase 2 — Catalog
Build:
External provider integration
Provider adapters
Canonical media model
Movies
TV
Anime
Metadata caching
Search
Media details
Genres
Cast
Seasons
Episodes

Result:
Scenic becomes a functioning entertainment database/browser.
96. Phase 3 — Tracking
Implement:
Watchlist
Watching
Completed
Paused
Dropped
Favorites
Ratings
Episode tracking
History
Continue Watching
Up Next
Quick Log
Undo

This is the first real Scenic MVP.
At this point users can genuinely use the product every day.
97. Phase 4 — Organization
Implement:
Library
Advanced filtering
Sorting
Custom lists
Bulk actions
Import/export

98. Phase 5 — Intelligence MVP
Now introduce:
Taste signals
Entertainment DNA
Basic recommendation ranking
Recommendation explanations
For You
Smart Watchlist

This is when Scenic stops being merely a tracker.
99. Phase 6 — Decision Engine
Implement:
Time filters
Mood
Commitment
Watchlist selection
Streaming availability
Context scoring
Decision ranking
Why Now explanations

Now Scenic becomes:
“I don't know what to watch.” → Scenic solves it.

100. Phase 7 — Statistics
Implement:
Watching statistics
Genre statistics
Time statistics
Ratings analysis
Viewing patterns
Year in Review
Shareable cards

101. Phase 8 — Spoiler Intelligence
Implement:
Progress-aware spoilers
Episode description protection
Character information filtering
Season protection
Spoiler preferences

102. Phase 9 — Availability
Implement:
Streaming providers
Country awareness
User subscriptions
Availability changes
Provider filtering
Watchlist availability
Release notifications

103. Phase 10 — Advanced Intelligence
Introduce:
Embeddings
Taste vectors
Semantic search
Hybrid recommendations
Natural language search
Ask Scenic
Context-aware recommendations

104. Phase 11 — Social
Only once individual usage is strong:
Friends
Activity
Shared lists
Recommendations between friends
Taste comparison
Group queues

105. Phase 12 — Platform Expansion
Then consider:
PWA
Android
iOS
Browser extension
TV integrations
Calendar integration
Notifications
Widgets

106. Scenic MVP
Do not interpret MVP as every feature described above.
A proper Scenic MVP is:
Authentication

Onboarding

Home

Search

Discover

Movies
TV
Anime

Media details

Watchlist

Watching/Completed status

Episode tracking

History

Ratings

Favorites

Continue Watching

Up Next

Basic recommendations

Settings

That is already a serious application.
107. V1
After MVP stabilizes:
Custom lists

Entertainment DNA

Statistics

Decision Engine

Smart Queue

Recommendation explanations

Import/export

Release calendar

Notifications

108. V2
Then:
Advanced Taste Graph

Semantic recommendations

Ask Scenic

Streaming intelligence

Advanced spoiler protection

Scenic Wrapped

Offline support

Better provider integrations

109. V3
Later:
Friends

Group recommendations

Shared lists

Collaborative queues

Mobile applications

Advanced integrations

110. Features We Should NOT Build First
Avoid starting with:
❌ Full AI assistant
❌ Social network
❌ Chat system
❌ Native Android app
❌ Native iOS app
❌ Kubernetes
❌ Microservices
❌ Complicated ML models
❌ Recommendation neural networks
❌ Real-time everything

These would increase complexity before Scenic proves its basic value.
111. Scenic's Most Important Features
If we reduce this whole specification to what makes Scenic Scenic, there are five essential systems:
1. Entertainment Memory
Everything you've watched,
rated, stopped, loved and saved.

2. Entertainment DNA
Understanding what you actually enjoy.

3. Decision Engine
Helping answer:
"What should I watch right now?"

4. Smart Queue
Your watchlist transformed from
storage into an active priority queue.

5. Progress Intelligence
Episodes, continuity,
up-next and spoiler awareness.

Those should receive significantly more product attention than generic features like user comments or social feeds.
112. The Product Loop
The most important architecture idea is this loop:
           DISCOVER
               │
               ▼
             WATCH
               │
               ▼
             TRACK
               │
               ▼
             RATE
               │
               ▼
        ENTERTAINMENT
            MEMORY
               │
               ▼
          TASTE MODEL
               │
               ▼
        RECOMMENDATIONS
               │
               ▼
        DECISION ENGINE
               │
               └──────────► WATCH

Every interaction should improve Scenic's understanding of the user.
That creates the long-term value of the platform.
113. Complete Page Map
The final route structure could eventually become:
PUBLIC
│
├── /
├── /login
├── /register
├── /forgot-password
└── /about


ONBOARDING
│
└── /onboarding


MAIN
│
├── /home
│
├── /discover
│
├── /movies
│
├── /tv
│
├── /anime
│
└── /search


MEDIA
│
├── /movie/:id
├── /tv/:id
├── /anime/:id
├── /person/:id
└── /episode/:id


PERSONAL
│
├── /library
├── /watchlist
├── /history
├── /lists
├── /lists/:id
├── /favorites
└── /calendar


INTELLIGENCE
│
├── /for-you
├── /decide
├── /dna
├── /stats
└── /wrapped/:year


ACCOUNT
│
├── /profile
├── /notifications
└── /settings

114. Recommended Development Order Right Now
Considering where Scenic is and that the goal is also for you to learn backend development properly while building it, I would develop it in this exact sequence:
01  Clean repository architecture
 ↓
02  PostgreSQL connection/pool
 ↓
03  Firebase Authentication
 ↓
04  Scenic user model
 ↓
05  External media-provider integration
 ↓
06  Canonical media model
 ↓
07  Search
 ↓
08  Movie/TV/Anime details
 ↓
09  Watchlist
 ↓
10  Media statuses
 ↓
11  Episode tracking
 ↓
12  Watch events/history
 ↓
13  Ratings/favorites
 ↓
14  Library
 ↓
15  Continue Watching
 ↓
16  Up Next
 ↓
17  Lists
 ↓
18  Basic statistics
 ↓
19  Recommendation V1
 ↓
20  Entertainment DNA V1
 ↓
21  Decision Engine V1
 ↓
22  Smart Queue
 ↓
23  Release calendar
 ↓
24  Notifications
 ↓
25  Import/export
 ↓
26  Spoiler protection
 ↓
27  Recommendation V2
 ↓
28  Ask Scenic
 ↓
29  Scenic Wrapped
 ↓
30  Advanced deployment/K3s

The key thing is that we should not jump directly into the Decision Engine or AI. First we need the tracking and data foundation that gives those intelligence systems something meaningful to reason over.
Scenic already has a strong concept: not a streaming clone, not simply a movie tracker, but a personal entertainment system built around Memory → Taste → Decision. That principle should guide every feature and UI decision going forward.
