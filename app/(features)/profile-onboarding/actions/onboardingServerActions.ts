'use server';

import { withUserScope } from '@/lib/supabase/server';
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
    const { supabase, userId } = await withUserScope();

    console.log('Starting save onboarding data for user:', userId);

    // First check if user exists in next_auth schema
    const { data: nextAuthUser } = await supabase.from('next_auth.users').select('id, email').eq('id', userId).single();

    if (!nextAuthUser) {
      throw new Error('User not found in NextAuth');
    }

    // Create or update profile
    const { error: profileUpsertError } = await supabase.from('profiles').upsert({
      id: userId,
      email: nextAuthUser.email,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });

    if (profileUpsertError) {
      console.error('Profile upsert error:', profileUpsertError);
      throw new Error(`Failed to update profile: ${profileUpsertError.message}`);
    }

    // Handle preferences
    const { error: preferencesUpsertError } = await supabase.from('user_preferences').upsert(
      {
        user_id: userId,
        genres: validatedData.selectedGenres,
        reading_goals: validatedData.bookGoals,
        reading_schedule: validatedData.readingSchedule,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      }
    );

    if (preferencesUpsertError) {
      console.error('Preferences upsert error:', preferencesUpsertError);
      throw new Error(`Failed to save preferences: ${preferencesUpsertError.message}`);
    }

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
