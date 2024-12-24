'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/app/lib/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const PreferenceSchema = z.object({
  daysOfWeek: z.array(z.string()),
  timeOfDay: z.string(),
  notifications: z.boolean(),
});

const OnboardingDataSchema = z.object({
  selectedGenres: z.array(z.string()),
  bookGoals: z.object({
    monthlyTarget: z.number().min(1),
    yearlyTarget: z.number().min(1),
  }),
  readingSchedule: z.object({
    preferences: z.array(PreferenceSchema),
  }),
  isOnboardingComplete: z.boolean(),
});

export type OnboardingData = z.infer<typeof OnboardingDataSchema>;

export async function saveOnboardingData(data: OnboardingData) {
  try {
    console.log('Received onboarding data:', data);

    // Ensure isOnboardingComplete is set to true
    const validatedData = OnboardingDataSchema.parse({
      ...data,
      isOnboardingComplete: true,
    });

    console.log('Validated onboarding data:', validatedData);

    // Get the current user
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No authenticated user found');
    }

    // Save to Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        ...validatedData,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    revalidatePath('/dashboard');
    console.log('Successfully completed onboarding save');

    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    console.error('Error in saveOnboardingData:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save onboarding data',
    };
  }
}
