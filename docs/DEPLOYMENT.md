# Deployment

## Frontend

Build with `npm ci` and `npm run build`; publish `dist` with SPA fallback to `index.html`. `vercel.json` provides that fallback on Vercel.

Set `VITE_API_BASE_URL=https://YOUR-NODE-HOST/api/v1` before building. Set the Firebase `VITE_FIREBASE_*` variables listed in the root `.env.example`. These identify the public Firebase app; do not put service account credentials or TMDB secrets in frontend variables. Add the frontend domain to Firebase Authentication's authorized domains.

## Node backend

Use Node 24 with a managed PostgreSQL database. From `backend`, run `npm ci`, `npm run build`, `npm run migrate:deploy`, then `npm start`. A container can be built from the project root with `docker build -f Dockerfile.backend -t scenic-api .`. Run migrations as a release job with that image before starting application replicas. Configure secrets through the host, not by copying `.env` into the image.

Required environment variables:

- `DATABASE_URL`: managed PostgreSQL connection string with the provider's TLS settings.
- `FIREBASE_PROJECT_ID`: the same project used by the frontend.
- `TMDB_ACCESS_TOKEN`: TMDB v3 API key used by the existing adapter.
- `FRONTEND_ORIGIN`: exact HTTPS frontend origin, without a trailing slash.
- `NODE_ENV=production`; set `PORT` if the host requires it.

AniList public catalog reads require no credential. Use HTTPS on both deployments. The frontend calls the backend directly; its origin must match `FRONTEND_ORIGIN`.

## Database migration history

The baseline represents the schema previously created with `prisma db push`. For a new empty database, `npm run migrate:deploy` applies both migrations.

For an existing database created with `db push`, back it up and verify it matches the baseline **before** running `npx prisma migrate resolve --applied 202609260001_baseline`, then `npm run migrate:deploy`. Do not mark an unrelated database as baselined. The local development database has already been baselined and upgraded. Future schema changes should use migrations; avoid `db push` on deployed databases.

## Monitoring and verification

- `/api/v1/health` checks that the Node process is alive; `/api/v1/ready` also checks PostgreSQL. Configure an uptime monitor for readiness.
- Request logs are JSON with request ID, method, path, status, and duration. Forward the hosting platform's stdout/stderr logs to its log service and alert on elevated 5xx counts and readiness failures. Query strings and authorization headers are excluded from request logs.
- Unhandled API failures return a generic error with request ID. React render failures show a recovery page. External alert delivery still requires the selected hosting service and notification destination.
- After deploying, sign in, save movie and anime titles, reload Library, edit a rating/progress value, and confirm persistence. Also confirm signed-out API requests return 401.
- Configure database backups and test restore before treating the deployment as production.

No remote resources have been created and no deployment has been published by these changes.
