# Scenic - Master Project Plan

This document outlines the long-term roadmap and phase-by-phase execution plan for Scenic, organized around the core product philosophy: **Track → Understand → Decide**.

## The Scenic Philosophy

```text
                 SCENIC
                   │
  ┌────────────────┼────────────────┐
  │                │                │
TRACK          UNDERSTAND         DECIDE
  │                │                │
Watch history   Genres          Recommendations
Movies/series   Themes          Decision Engine
Episodes        Actors          Smart Queue
Franchises      Directors       Surprise Me
Collections     Studios         Group Picks
Rewatches       Behaviour       Why This?
Progress        Taste DNA
  │                │                │
  └────────────────┼────────────────┘
                   │
             PERSONAL
          ENTERTAINMENT
               GRAPH
```

---

## ✅ Phase 0-3: Foundation, Auth, & Core Tracking (Completed)
- **Foundation:** React/Vite/TS frontend, Node/Express/Prisma backend.
- **Auth:** Firebase Auth + Postgres User sync.
- **UX:** Soft-Dark UI, global Navigation, massive cinematic Hero sections.
- **Core Tracking:** TMDB integration, Watchlist & History endpoints, cinematic Media Detail page.

---

## ⏳ Phase 4: Organization & Deep Tracking (MVP)
*Focus: Upgrading basic tracking into rich collection and progress tracking.*
- [ ] **Library Dashboard:** Aggregate Watchlist and History with sorting/filtering.
- [ ] **Franchise & Collection Progress:** Track completion rates for Marvel Cinematic Universe, Star Wars, Harry Potter, Studio Ghibli, Pixar, etc.
- [ ] **Granular TV/Anime Tracking:** Track Series Started, Seasons Completed, and exact Episode progress (e.g., 45/62 episodes watched, 73% complete).
- [ ] **Rewatch Intelligence:** Differentiate first watches from rewatches. Track multiple watch dates and rating changes over time.
- [ ] **Basic Statistics (Time-based):** Movies/Episodes watched this Year/Month, and hours watched.
- [ ] **Actor & Director Tracking:** Automatically calculate completion progress for specific creators (e.g., "You've seen 10 of Christopher Nolan's 12 films").

---

## 📅 Phase 5: The Taste Engine (Understand)
*Focus: Transforming raw tracking data into the "Personal Entertainment Graph".*
- [ ] **Hierarchical Genre & Theme Tracking:** Break down basic "Sci-Fi" into Space Opera, Cyberpunk, Time Travel, etc. Track percentages and completion rates per sub-genre.
- [ ] **Backlog Analytics:** Analyze the Watchlist (e.g., "Added 624 days ago", "Estimated watch time: 412 hours").
- [ ] **Completion Rates & Drop Analysis:** Track percentage of TV shows finished vs. dropped, and optional reasons for dropping.
- [ ] **Demographic Tracking:** Analytics on Country of origin, Language, and Release Decade.
- [ ] **Recommendation Feedback Loop:** "Was this recommendation useful? Yes/No" -> feeds back into the engine.

---

## 📅 Phase 6: The Decision Engine (Decide)
*Focus: Answering "What should I watch next?"*
- [ ] **The "What to Watch" Wizard:** Inputs for Time available, Mood, and Availability.
- [ ] **"Why This?" Explanations:** e.g., *“You have watched 90% of the MCU, this is one of your remaining titles, and it fits your available time.”*
- [ ] **Catch-Up Plans:** "Stranger Things S5 begins in 12 days. 7 episodes remaining. Estimated catch-up time: 8h 14m."
- [ ] **"What Am I Missing?" Button:** Instantly find unwatched entries in a beloved franchise or director's filmography.
- [ ] **Surprise Me (Intelligent Roulette):** A weighted randomizer based on Taste, Watchlist, Mood, and Time.
- [ ] **Companion / Group Taste:** Calculate taste intersections between two or more users to find the perfect mutual watch.

---

## 📅 Phase 7+: Advanced Analytics & Wrap (Future Roadmap)
*Focus: Gamification, insights, and expanded ecosystem.*
- [ ] **Watch Calendar / Heatmap:** A GitHub-style contribution graph for daily watching habits.
- [ ] **Personal Milestones:** Shareable cards for "100th Movie", "1,000 Watch Hours", "MCU 100% Complete".
- [ ] **Binge Tracking & Watch Behaviour:** Detect longest binges, typical watch days (e.g., "You usually watch movies on weekends").
- [ ] **Availability Engine:** JustWatch API integration to filter strictly by user's active streaming subscriptions.
- [ ] **Personal Tags:** Custom organizational tags (Comfort, Mind-bending, Weekend watch).
- [ ] **Scenic Wrapped:** Elaborate yearly viewing wrap-ups.
