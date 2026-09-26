import express from 'express';
import cors from 'cors';
import './config/firebase'; // Force initialization of Firebase
import prisma from './config/prisma';
import { randomUUID } from 'node:crypto';

const app = express();
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV === 'production') {
  for (const name of ['DATABASE_URL', 'FIREBASE_PROJECT_ID', 'TMDB_ACCESS_TOKEN', 'FRONTEND_ORIGIN']) {
    if (!process.env[name]) throw new Error(`Missing production configuration: ${name}`);
  }
}

app.disable('x-powered-by');
app.use((req, res, next) => {
  const requestId = randomUUID();
  const start = Date.now();
  res.setHeader('X-Request-ID', requestId);
  res.on('finish', () => console.log(JSON.stringify({ event: 'request', requestId, method: req.method, path: req.path, status: res.statusCode, durationMs: Date.now() - start })));
  next();
});

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '32kb' }));

import usersRoutes from './modules/users/users.routes';
import mediaRoutes from './modules/media/media.routes';
import trackingRoutes from './modules/tracking/tracking.routes';
import animeRoutes from './modules/media/anime.routes';
import animeTrackingRoutes from './modules/tracking/anime-tracking.routes';

app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/anime', animeRoutes);
app.use('/api/v1/tracking/anime', animeTrackingRoutes);
app.use('/api/v1/tracking', trackingRoutes);


app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'scenic-api' });
});

app.get('/api/v1/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: 'ready' });
  } catch {
    return res.status(503).json({ status: 'unavailable' });
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  void _next; // Express recognizes error handlers by their four-argument signature.
  const status = error instanceof SyntaxError ? 400 : (error as { status?: number })?.status === 413 ? 413 : 500;
  console.error(JSON.stringify({ event: 'request_error', requestId: res.getHeader('X-Request-ID'), status }));
  res.status(status).json({ error: status === 400 ? 'Invalid JSON body' : status === 413 ? 'Request body is too large' : 'Unexpected server error', requestId: res.getHeader('X-Request-ID') });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => server.close(() => { void prisma.$disconnect().finally(() => process.exit(0)); }));
}
