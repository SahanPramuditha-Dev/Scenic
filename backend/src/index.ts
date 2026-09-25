import express from 'express';
import cors from 'cors';
import './config/firebase'; // Force initialization of Firebase

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

import usersRoutes from './modules/users/users.routes';
import mediaRoutes from './modules/media/media.routes';
import trackingRoutes from './modules/tracking/tracking.routes';

app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/tracking', trackingRoutes);


app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'scenic-api' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});
