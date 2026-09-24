import { Request, Response, NextFunction } from 'express';
import { firebaseAdmin } from '../config/firebase';

// Extend Express Request to include our user object
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Mock token support for local dev without firebase service account
    if (token.startsWith('mock-token-')) {
      const uid = token.replace('mock-token-', '');
      req.user = { uid, email: 'mock@scenic.app' };
      return next();
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
