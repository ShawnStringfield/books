export interface UserOnboardingPreferences {
  id: string;
  user_id: string;
  selected_genres: string[];
  book_goals: {
    monthly_target: number;
    yearly_target: number;
  };
  reading_schedule: {
    preferences: {
      days_of_week: string[];
      notifications: boolean;
    }[];
  };
  is_onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

// types/supabase.ts
export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          genres: string[];
          book_goals: {
            monthlyTarget: number;
            yearlyTarget: number;
          };
          reading_schedule: {
            preferences: Array<{
              daysOfWeek: string[];
              notifications: boolean;
            }>;
          };
          is_onboarding_complete: boolean;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
