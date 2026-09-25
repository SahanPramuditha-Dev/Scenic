import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../stores/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const token = await user.getIdToken();
          setUser(user, token);
        } else {
          setUser(null, null);
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        setUser(null, null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return <>{children}</>;
}
