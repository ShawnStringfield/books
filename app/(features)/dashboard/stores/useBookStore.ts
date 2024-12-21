import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Book, Highlight, ReadingStatus } from '../types/books';
import { v4 as uuidv4 } from 'uuid';

interface HighlightFilters {
  bookId?: string;
  favorite?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface BookState {
  books: Book[];
  highlights: Highlight[];
  isLoading: boolean;
  error: string | null;
  isAddBookDrawerOpen: boolean;
  hasHydrated: boolean;
}

interface BookActions {
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
  updateBookGenre: (bookId: string, genre: string) => void;
  deleteBook: (bookId: string) => void;
  deleteHighlight: (highlightId: string) => void;
  filterHighlights: (filters: HighlightFilters) => Highlight[];
}

export type BookStore = BookState & BookActions;

export const useBookStore = create<BookStore>()(
  persist(
    (set, get) => ({
      // Initial state
      books: [],
      highlights: [],
      isLoading: false,
      error: null,
      isAddBookDrawerOpen: false,
      hasHydrated: false,

      // Actions
      addBook: (book) =>
        set((state) => {
          const isFirstBook = state.books.length === 0;
          const status = isFirstBook ? ReadingStatus.IN_PROGRESS : ReadingStatus.NOT_STARTED;
          const startDate = isFirstBook ? new Date().toISOString() : undefined;
          const currentPage = isFirstBook ? 1 : 0;
          const categories = book.categories || [];

          return {
            books: [
              ...state.books,
              {
                ...book,
                description: book?.description || '',
                status,
                currentPage,
                highlights: [],
                startDate,
                categories,
                genre: categories[0] || 'Unknown',
              },
            ],
            error: null,
            isAddBookDrawerOpen: false,
          };
        }),

      addHighlight: (bookId, highlight) =>
        set((state) => {
          const newHighlight = {
            id: uuidv4(),
            bookId,
            ...highlight,
            createdAt: new Date().toISOString(),
            isFavorite: false,
          };

          return {
            highlights: [newHighlight, ...state.highlights], // Add to start for chronological order
            books: state.books.map((book) =>
              book.id === bookId
                ? {
                    ...book,
                    highlights: [newHighlight, ...(book.highlights || [])], // Keep consistent with main highlights array
                  }
                : book
            ),
          };
        }),

      toggleFavoriteHighlight: (id) =>
        set((state) => ({
          highlights: state.highlights.map((h) => (h.id === id ? { ...h, isFavorite: !h.isFavorite } : h)),
          books: state.books.map((book) => ({
            ...book,
            highlights: book.highlights?.map((h) => (h.id === id ? { ...h, isFavorite: !h.isFavorite } : h)) || [],
          })),
        })),

      updateReadingProgress: (bookId, currentPage) =>
        set((state) => {
          const book = state.books.find((b) => b.id === bookId);
          if (!book) return state;

          let status = book.status;
          let startDate = book.startDate;
          let completedDate = book.completedDate;

          // Update status and dates based on progress
          if (currentPage === 0) {
            status = ReadingStatus.NOT_STARTED;
            startDate = undefined;
            completedDate = undefined;
          } else if (currentPage === book.totalPages) {
            status = ReadingStatus.COMPLETED;
            startDate = startDate || new Date().toISOString();
            completedDate = new Date().toISOString();
          } else if (currentPage > 0) {
            status = ReadingStatus.IN_PROGRESS;
            startDate = startDate || new Date().toISOString();
            completedDate = undefined;
          }

          return {
            books: state.books.map((b) =>
              b.id === bookId
                ? {
                    ...b,
                    currentPage,
                    status,
                    startDate,
                    completedDate,
                  }
                : b
            ),
          };
        }),

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

          const completedDate = status === ReadingStatus.COMPLETED ? new Date().toISOString() : undefined;
          const startDate = status === ReadingStatus.IN_PROGRESS && !book.startDate ? new Date().toISOString() : book.startDate;

          return {
            books: state.books.map((b) =>
              b.id === bookId
                ? {
                    ...b,
                    status,
                    completedDate,
                    startDate,
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

      updateBookGenre: (bookId, genre) =>
        set((state) => ({
          books: state.books.map((b) =>
            b.id === bookId
              ? {
                  ...b,
                  genre,
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

      filterHighlights: (filters: HighlightFilters) => {
        const state = get();
        return state.highlights.filter((highlight) => {
          if (filters.bookId && highlight.bookId !== filters.bookId) return false;
          if (filters.favorite && !highlight.isFavorite) return false;
          if (filters.dateRange) {
            const { start, end } = filters.dateRange;
            const highlightDate = new Date(highlight.createdAt);
            if (highlightDate < start || highlightDate > end) return false;
          }
          return true;
        });
      },
    }),
    {
      name: 'book-store',
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

// Enhanced selectors for better performance
export const selectBooks = (state: BookStore) => state.books;
export const selectHighlights = (state: BookStore) => state.highlights;
export const selectRecentHighlights = (state: BookStore) => state.highlights.slice(0, 5);
export const selectFavoriteHighlights = (state: BookStore) => state.highlights.filter((h) => h.isFavorite);
export const selectHighlightsByBook = (bookId: string) => (state: BookStore) => state.highlights.filter((h) => h.bookId === bookId);
export const selectTotalHighlights = (state: BookStore) => state.highlights.length;

// New selector for all highlights with book details
export interface EnrichedHighlight extends Highlight {
  bookTitle: string;
  bookAuthor: string;
}

export const selectEnrichedHighlights = (state: BookStore): EnrichedHighlight[] => {
  const bookMap = new Map(state.books.map((book) => [book.id, book]));

  return state.highlights
    .map((highlight) => {
      const book = bookMap.get(highlight.bookId);
      if (!book) return null;

      return {
        ...highlight,
        bookTitle: book.title,
        bookAuthor: book.author,
      };
    })
    .filter((h): h is EnrichedHighlight => h !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Sort options for highlights
export type HighlightSortOption = 'date' | 'book' | 'page';

export const selectSortedHighlights =
  (sortBy: HighlightSortOption) =>
  (state: BookStore): EnrichedHighlight[] => {
    const enrichedHighlights = selectEnrichedHighlights(state);

    switch (sortBy) {
      case 'date':
        return enrichedHighlights; // Already sorted by date in selectEnrichedHighlights
      case 'book':
        return [...enrichedHighlights].sort((a, b) => a.bookTitle.localeCompare(b.bookTitle) || a.page - b.page);
      case 'page':
        return [...enrichedHighlights].sort((a, b) => a.bookTitle.localeCompare(b.bookTitle) || a.page - b.page);
      default:
        return enrichedHighlights;
    }
  };

export const selectIsLoading = (state: BookStore) => state.isLoading;
export const selectError = (state: BookStore) => state.error;
export const selectHasHydrated = (state: BookStore) => state.hasHydrated;
export const selectCurrentlyReading = (state: BookStore) => state.books.filter((book) => book.status === ReadingStatus.IN_PROGRESS);
export const selectFirstCurrentlyReading = (state: BookStore) => state.books.find((book) => book.status === ReadingStatus.IN_PROGRESS);
export const selectIsLastBook = (state: BookStore) => state.books.length === 1;
