import { Request, Response, NextFunction } from 'express';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import '../../config/firebase';

// Extend Express Request to include our user object
declare global {
  // Express exposes request augmentation through its global namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (token.split('.').length !== 3) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
