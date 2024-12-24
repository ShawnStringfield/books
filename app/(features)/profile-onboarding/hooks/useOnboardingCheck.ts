'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/app/lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export function useOnboardingCheck() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          console.log('No authenticated user, redirecting to login');
          router.push('/login');
          return;
        }

        // Check user's onboarding status in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists() || !userDoc.data()?.isOnboardingComplete) {
          console.log('Onboarding not complete, redirecting to onboarding');
          router.push('/profile-onboarding');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        router.push('/profile-onboarding');
      } finally {
        setIsChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return isChecking;
}
