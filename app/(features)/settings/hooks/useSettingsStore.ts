import { create } from "zustand";

interface ReadingGoals {
  monthlyTarget: number;
  yearlyTarget: number;
}

interface SettingsState {
  readingGoals: ReadingGoals;
  selectedGenres: string[];
  isLoading: boolean;
  error: Error | null;
}

interface SettingsStore extends SettingsState {
  updateReadingGoals: (goals: ReadingGoals) => void;
  updateSelectedGenres: (genres: string[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

const INITIAL_STATE: SettingsState = {
  readingGoals: {
    monthlyTarget: 1,
    yearlyTarget: 12,
  },
  selectedGenres: [],
  isLoading: false,
  error: null,
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...INITIAL_STATE,

  updateReadingGoals: (goals: ReadingGoals) => {
    set({ readingGoals: goals });
  },

  updateSelectedGenres: (genres: string[]) => {
    set({ selectedGenres: genres });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: Error | null) => {
    set({ error });
  },
}));

// Selectors
export const useReadingGoals = () =>
  useSettingsStore((state) => state.readingGoals);

export const useSelectedGenres = () =>
  useSettingsStore((state) => state.selectedGenres);

export const useSettingsStatus = () => {
  const isLoading = useSettingsStore((state) => state.isLoading);
  const error = useSettingsStore((state) => state.error);
  return { isLoading, error };
};
