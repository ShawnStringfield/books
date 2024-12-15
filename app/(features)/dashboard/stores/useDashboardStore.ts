import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Book, Highlight, ReadingStatus } from '../types/books';
import { v4 as uuidv4 } from 'uuid';

interface DashboardState {
  books: Book[];
  highlights: Highlight[];
  isLoading: boolean;
  error: string | null;
  isAddBookDrawerOpen: boolean;
  hasHydrated: boolean;
}

interface DashboardActions {
  addBook: (book: Book) => void;
  addHighlight: (bookId: string, highlight: Omit<Highlight, 'id' | 'bookId' | 'createdAt'>) => void;
  toggleFavoriteHighlight: (id: string) => void;
  updateReadingProgress: (bookId: string, currentPage: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAddBookDrawerOpen: (isOpen: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  updateBookStatus: (bookId: string, status: ReadingStatus) => void;
  updateBookDescription: (bookId: string, description: string) => void;
  deleteBook: (bookId: string) => void;
  deleteHighlight: (highlightId: string) => void;
}

export type DashboardStore = DashboardState & DashboardActions;

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      // Initial state
      books: [],
      highlights: [],
      isLoading: false,
      error: null,
      isAddBookDrawerOpen: false,
      hasHydrated: false,

      // Actions
      addBook: (book) =>
        set((state) => ({
          books: [
            ...state.books,
            {
              ...book,
              description: book?.description || '',
              status: state.books.length === 0 ? ReadingStatus.IN_PROGRESS : ReadingStatus.NOT_STARTED,
              currentPage: 0,
              highlights: [],
            },
          ],
          error: null,
          isAddBookDrawerOpen: false,
        })),

      addHighlight: (bookId, highlight) =>
        set((state) => {
          const newHighlight = {
            id: uuidv4(),
            bookId,
            ...highlight,
            createdAt: new Date(),
            isFavorite: false,
          };

          return {
            highlights: [...state.highlights, newHighlight],
            books: state.books.map((book) =>
              book.id === bookId
                ? {
                    ...book,
                    highlights: [...(book.highlights || []), newHighlight],
                  }
                : book
            ),
          };
        }),

      toggleFavoriteHighlight: (id) =>
        set((state) => ({
          highlights: state.highlights.map((h) => (h.id === id ? { ...h, isFavorite: !h.isFavorite } : h)),
        })),

      updateReadingProgress: (bookId, currentPage) =>
        set((state) => ({
          books: state.books.map((b) => (b.id === bookId ? { ...b, currentPage } : b)),
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setAddBookDrawerOpen: (isOpen) => set({ isAddBookDrawerOpen: isOpen }),

      setHasHydrated: (state) => set({ hasHydrated: state }),

      updateBookStatus: (bookId, status) =>
        set((state) => {
          const book = state.books.find((b) => b.id === bookId);
          if (!book) return state;

          // Prevent changing from COMPLETED to NOT_STARTED
          if (book.status === ReadingStatus.COMPLETED && status === ReadingStatus.NOT_STARTED) {
            return state;
          }

          // Only allow NOT_STARTED if current status is IN_PROGRESS
          if (status === ReadingStatus.NOT_STARTED && book.status !== ReadingStatus.IN_PROGRESS) {
            return state;
          }

          const completedDate = status === ReadingStatus.COMPLETED ? new Date() : undefined;

          return {
            books: state.books.map((b) =>
              b.id === bookId
                ? {
                    ...b,
                    status,
                    completedDate,
                  }
                : b
            ),
          };
        }),

      updateBookDescription: (bookId, description) =>
        set((state) => ({
          books: state.books.map((b) =>
            b.id === bookId
              ? {
                  ...b,
                  description,
                }
              : b
          ),
        })),

      deleteBook: (bookId) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== bookId),
        }));
      },

      deleteHighlight: (highlightId: string) =>
        set((state) => {
          const highlight = state.highlights.find((h) => h.id === highlightId);
          if (!highlight) return state;

          return {
            highlights: state.highlights.filter((h) => h.id !== highlightId),
            books: state.books.map((book) =>
              book.id === highlight.bookId
                ? {
                    ...book,
                    highlights: book.highlights?.filter((h) => h.id !== highlightId) || [],
                  }
                : book
            ),
          };
        }),
    }),
    {
      name: 'dashboard-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

// Selectors for better performance
export const selectBooks = (state: DashboardStore) => state.books;
export const selectHighlights = (state: DashboardStore) => state.highlights;
export const selectIsLoading = (state: DashboardStore) => state.isLoading;
export const selectError = (state: DashboardStore) => state.error;
export const selectHasHydrated = (state: DashboardStore) => state.hasHydrated;
export const selectCurrentlyReading = (state: DashboardStore) => state.books.filter((book) => book.status === ReadingStatus.IN_PROGRESS);
export const selectFirstCurrentlyReading = (state: DashboardStore) => state.books.find((book) => book.status === ReadingStatus.IN_PROGRESS);
export const selectIsLastBook = (state: DashboardStore) => state.books.length === 1;
