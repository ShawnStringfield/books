import { create } from 'zustand';
import type { ReadingStatusType } from './types';

interface Filters {
  status: ReadingStatusType | 'all';
  genre: string;
  searchQuery: string;
}

interface UIState {
  isAddBookModalOpen: boolean;
  selectedBookId: string | null;
  currentView: 'grid' | 'list';
  filters: Filters;
  isSidebarOpen: boolean;
  isFilterDrawerOpen: boolean;
  setAddBookModalOpen: (isOpen: boolean) => void;
  setSelectedBook: (bookId: string | null) => void;
  setCurrentView: (view: 'grid' | 'list') => void;
  setFilters: (filters: Partial<Filters>) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setFilterDrawerOpen: (isOpen: boolean) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: Filters = {
  status: 'all',
  genre: 'all',
  searchQuery: '',
};

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isAddBookModalOpen: false,
  selectedBookId: null,
  currentView: 'grid',
  filters: DEFAULT_FILTERS,
  isSidebarOpen: true,
  isFilterDrawerOpen: false,

  // Actions
  setAddBookModalOpen: (isOpen) => set({ isAddBookModalOpen: isOpen }),
  setSelectedBook: (bookId) => set({ selectedBookId: bookId }),
  setCurrentView: (view) => set({ currentView: view }),
  setFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setFilterDrawerOpen: (isOpen) => set({ isFilterDrawerOpen: isOpen }),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
