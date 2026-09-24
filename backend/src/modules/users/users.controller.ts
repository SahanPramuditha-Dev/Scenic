import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const getCurrentUser = async (req: Request, res: Response) => {
  const firebaseUser = req.user;

  if (!firebaseUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUser.uid },
    });

    // Auto-register if user doesn't exist yet
    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.name || null,
          avatarUrl: firebaseUser.picture || null,
        },
      });
    }

    return res.json({
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      onboardingComplete: user.onboardingComplete,
    });
  } catch (error) {
    console.error('Error fetching/creating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
