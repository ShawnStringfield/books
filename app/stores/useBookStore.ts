import { create } from 'zustand';
import type { Book, ReadingStatusType } from './types';

interface BookUIState {
  currentBook: Book | null;
  currentStatus: ReadingStatusType;
  isAddBookSheetOpen: boolean;
  hasHydrated: boolean;
  setCurrentBook: (book: Book | null) => void;
  setCurrentStatus: (status: ReadingStatusType) => void;
  setAddBookSheetOpen: (isOpen: boolean) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useBookStore = create<BookUIState>((set) => ({
  // Initial state
  currentBook: null,
  currentStatus: 'not-started',
  isAddBookSheetOpen: false,
  hasHydrated: false,

  // Actions
  setCurrentBook: (book) => set({ currentBook: book }),
  setCurrentStatus: (status) => set({ currentStatus: status }),
  setAddBookSheetOpen: (isOpen) => set({ isAddBookSheetOpen: isOpen }),
  setHasHydrated: (state) => set({ hasHydrated: state }),
}));
