# Scenic - Project Overview

## What is Scenic?
Scenic is a "Personal Entertainment Operating System". It is designed to be the ultimate tracker and decision engine for movies, TV series, and anime. The core pillars of Scenic are:
1. **Memory:** Tracking what you've watched, what you want to watch, and your ratings.
2. **Taste:** Understanding your unique preferences across genres, directors, cast, and themes.
3. **Decision:** An intelligence engine that helps you decide *what* to watch next based on mood, time, and availability.

## Tech Stack & Architecture
**Strict Architectural Mandate:** The primary application must follow a traditional Full-Stack architecture:
- **Frontend:** React + TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand (state management), React Router, TanStack Query, Firebase Auth.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM. *(Note: Python microservices are only permitted much later in the project for ML/Intelligence tasks).*
- **Database:** PostgreSQL (Running locally via Docker).
- **External APIs:** TMDB (The Movie Database) for media metadata.

## Critical Developer Guidelines & Quirks
Any AI or developer working on this project must adhere to the following rules based on the local environment:

1. **Prisma Version Conflict:** The global system has a Prisma v8-rc composer alias that breaks standard commands. **Always** run Prisma commands using the local installation inside the `backend` directory: `npx prisma <command>`.
2. **PostgreSQL Port Mapping:** A native Windows PostgreSQL service exists on port 5432. To avoid conflicts, the Docker PostgreSQL container (`scenic_db`) is mapped to **port 5433** (`127.0.0.1:5433`). Ensure `.env` files reflect this.
3. **TMDB API Key Format:** The project uses a TMDB v3 API Key (32-character string), NOT a v4 JWT Bearer token. It must be passed as a query parameter (`?api_key=...`), which is currently handled globally by the Axios instance in `backend/src/modules/media/tmdb.service.ts`.
4. **TMDB TLS:** Keep certificate verification enabled. If a local environment cannot verify TMDB's certificate, install the appropriate trusted CA certificate rather than disabling TLS for the process.
5. **UI/UX Design Language:** The app uses a premium "Soft Dark" aesthetic (`bg-[#0a0a0a]`, `#131316`, `#1c1c21`), avoiding pure stark black/white contrasts. Accents are mostly deep indigos/violets.
6. **Vite COOP/COEP Headers:** To prevent Firebase `auth/popup-blocked` errors during local dev, Vite is configured with `unsafe-none` for Cross-Origin-Opener policies.
