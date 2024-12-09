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
  deleteBook: (bookId: string) => void;
}

export type DashboardStore = DashboardState & DashboardActions;

interface VersionedState extends DashboardState {
  version?: number;
}

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
              status: state.books.length === 0 ? ReadingStatus.IN_PROGRESS : ReadingStatus.NOT_STARTED,
              currentPage: 0,
              highlights: [],
            },
          ],
          error: null,
        })),

      addHighlight: (bookId, highlight) =>
        set((state) => ({
          highlights: [
            ...state.highlights,
            {
              id: uuidv4(),
              bookId,
              ...highlight,
              createdAt: new Date(),
              isFavorite: false,
            },
          ],
          books: state.books.map((book) =>
            book.id === bookId
              ? {
                  ...book,
                  highlights: book.highlights || [],
                }
              : book
          ),
        })),

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
        set((state) => ({
          books: state.books.map((b) =>
            b.id === bookId
              ? {
                  ...b,
                  status,
                  completedDate: status === ReadingStatus.COMPLETED ? new Date() : b.completedDate,
                }
              : b
          ),
        })),

      deleteBook: (bookId) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== bookId),
        }));
      },
    }),
    {
      name: 'dashboard-storage',
      // Add migration configuration
      migrate: (persistedState: unknown): VersionedState => {
        // If it's an older version or undefined, migrate to new structure
        if (!(persistedState as VersionedState)?.version) {
          return {
            books: [],
            highlights: [],
            isLoading: false,
            error: null,
            isAddBookDrawerOpen: false,
            hasHydrated: false,
            version: 1,
          };
        }
        return persistedState as VersionedState;
      },
      version: 1, // Current version number
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => () => {
        // Set hasHydrated to true after rehydration
        setTimeout(() => {
          useDashboardStore.getState().setHasHydrated(true);
        }, 0);
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
