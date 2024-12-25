import { create } from "zustand";
import type { Book, ReadingStatusType, Highlight } from "./types";

export interface BookStore {
  currentBook: Book | null;
  currentStatus: ReadingStatusType;
  isAddBookSheetOpen: boolean;
  hasHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  highlights: Highlight[];
  books: Book[];
  setCurrentBook: (book: Book | null) => void;
  setCurrentStatus: (status: ReadingStatusType) => void;
  setAddBookSheetOpen: (isOpen: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBookStore = create<BookStore>((set) => ({
  // Initial state
  currentBook: null,
  currentStatus: "not-started",
  isAddBookSheetOpen: false,
  hasHydrated: false,
  isLoading: false,
  error: null,
  highlights: [],
  books: [],

  // Actions
  setCurrentBook: (book) => set({ currentBook: book }),
  setCurrentStatus: (status) => set({ currentStatus: status }),
  setAddBookSheetOpen: (isOpen) => set({ isAddBookSheetOpen: isOpen }),
  setHasHydrated: (state) => set({ hasHydrated: state }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

// Selectors
export const selectIsLoading = (state: BookStore) => state.isLoading;
export const selectError = (state: BookStore) => state.error;
export const selectHasHydrated = (state: BookStore) => state.hasHydrated;
export const selectFavoriteHighlights = (state: BookStore) =>
  state.highlights?.filter((h) => h.isFavorite) || [];
