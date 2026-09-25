import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export async function getOrCreateUser(firebaseUser: NonNullable<Request['user']>) {
  return prisma.user.upsert({
    where: { firebaseUid: firebaseUser.uid },
    update: {},
    create: {
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email || null,
      displayName: firebaseUser.name || null,
      avatarUrl: firebaseUser.picture || null,
    },
  });
}

export const getCurrentUser = async (req: Request, res: Response) => {
  const firebaseUser = req.user;

  if (!firebaseUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await getOrCreateUser(firebaseUser);

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
