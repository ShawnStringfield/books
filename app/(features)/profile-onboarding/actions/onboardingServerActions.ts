'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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
    const validatedData = OnboardingDataSchema.parse(data);
    console.log('Saving onboarding data:', validatedData);
    revalidatePath('/dashboard');
    console.log('Successfully completed onboarding save');
    return { success: true };
  } catch (error) {
    console.error('Error in saveOnboardingData:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save onboarding data',
    };
  }
}
