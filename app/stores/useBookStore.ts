import { create } from 'zustand';
import type { Book, ReadingStatusType } from './types';

interface BookUIState {
  currentBook: Book | null;
  currentStatus: ReadingStatusType;
  isAddBookSheetOpen: boolean;
  hasHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  setCurrentBook: (book: Book | null) => void;
  setCurrentStatus: (status: ReadingStatusType) => void;
  setAddBookSheetOpen: (isOpen: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBookStore = create<BookUIState>((set) => ({
  // Initial state
  currentBook: null,
  currentStatus: 'not-started',
  isAddBookSheetOpen: false,
  hasHydrated: false,
  isLoading: false,
  error: null,

  // Actions
  setCurrentBook: (book) => set({ currentBook: book }),
  setCurrentStatus: (status) => set({ currentStatus: status }),
  setAddBookSheetOpen: (isOpen) => set({ isAddBookSheetOpen: isOpen }),
  setHasHydrated: (state) => set({ hasHydrated: state }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

// Selectors
export const selectIsLoading = (state: BookUIState) => state.isLoading;
export const selectError = (state: BookUIState) => state.error;
export const selectHasHydrated = (state: BookUIState) => state.hasHydrated;
