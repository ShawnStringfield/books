import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  totalPages: number;
  currentPage?: number;
  startDate?: Date;
  completedDate?: Date;
}

export interface Highlight {
  id: string;
  bookId: string;
  text: string;
  page: number;
  isFavorite: boolean;
  createdAt: Date;
}

interface BookStore {
  books: Book[];
  highlights: Highlight[];
  addBook: (book: Book) => void;
  addHighlight: (highlight: Highlight) => void;
  toggleFavoriteHighlight: (id: string) => void;
  updateReadingProgress: (bookId: string, currentPage: number) => void;
}

type PersistedState = Pick<BookStore, 'books' | 'highlights'>;

const isValidPersistedState = (state: unknown): state is PersistedState => {
  if (typeof state !== 'object' || state === null) return false;

  const s = state as Record<string, unknown>;
  return Array.isArray(s.books) && Array.isArray(s.highlights);
};

export const useBookStore = create<BookStore>()(
  persist(
    (set) => ({
      books: [],
      highlights: [],
      addBook: (book) => set((state) => ({ books: [...state.books, book] })),
      addHighlight: (highlight) => set((state) => ({ highlights: [...state.highlights, highlight] })),
      toggleFavoriteHighlight: (id) =>
        set((state) => ({
          highlights: state.highlights.map((h) => (h.id === id ? { ...h, isFavorite: !h.isFavorite } : h)),
        })),
      updateReadingProgress: (bookId, currentPage) =>
        set((state) => ({
          books: state.books.map((b) => (b.id === bookId ? { ...b, currentPage } : b)),
        })),
    }),
    {
      name: 'book-store',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        const defaultState: PersistedState = { books: [], highlights: [] };

        if (!isValidPersistedState(persistedState)) {
          return defaultState;
        }

        if (version === 0) {
          return {
            books: persistedState.books || [],
            highlights: persistedState.highlights || [],
          };
        }

        return persistedState;
      },
    }
  )
);
