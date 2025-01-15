import { create } from "zustand";
import type { UserSettings } from "@/app/lib/firebase/services/settings";

export interface SettingsStore {
  settings: UserSettings | null;
  isInitialized: boolean;
  initializeStore: () => void;
  setSettings: (settings: UserSettings) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: null,
  isInitialized: false,
  initializeStore: () => set({ isInitialized: true }),
  setSettings: (settings) => set({ settings }),
}));
