import { create } from "zustand";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase/firebase";
import { auth } from "@/app/lib/firebase/firebase";

interface ReadingGoals {
  monthlyTarget: number;
  yearlyTarget: number;
}

interface SettingsState {
  readingGoals: ReadingGoals;
  selectedGenres: string[];
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
}

interface SettingsStore extends SettingsState {
  updateReadingGoals: (goals: ReadingGoals) => Promise<void>;
  updateSelectedGenres: (genres: string[]) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  initializeStore: () => Promise<void>;
}

const INITIAL_STATE: SettingsState = {
  readingGoals: {
    monthlyTarget: 2,
    yearlyTarget: 24,
  },
  selectedGenres: [],
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...INITIAL_STATE,

  updateReadingGoals: async (goals: ReadingGoals) => {
    const user = auth.currentUser;
    if (!user?.uid) {
      throw new Error("Authentication required to update reading goals");
    }

    try {
      set({ isLoading: true, error: null });
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { bookGoals: goals }, { merge: true });
      set({ readingGoals: goals });
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("Failed to update reading goals");
      set({ error: err });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateSelectedGenres: async (genres: string[]) => {
    const user = auth.currentUser;
    if (!user?.uid) {
      throw new Error("Authentication required to update genres");
    }

    try {
      set({ isLoading: true, error: null });
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { selectedGenres: genres }, { merge: true });
      set({ selectedGenres: genres });
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Failed to update genres");
      set({ error: err });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: Error | null) => {
    set({ error });
  },

  initializeStore: async () => {
    const user = auth.currentUser;
    if (!user?.uid || get().isInitialized) return;

    try {
      set({ isLoading: true, error: null });
      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        set({
          readingGoals: data.bookGoals || INITIAL_STATE.readingGoals,
          selectedGenres: data.selectedGenres || INITIAL_STATE.selectedGenres,
          isInitialized: true,
        });
      } else {
        set({ isInitialized: true });
      }
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("Failed to initialize settings");
      set({ error: err });
    } finally {
      set({ isLoading: false });
    }
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
