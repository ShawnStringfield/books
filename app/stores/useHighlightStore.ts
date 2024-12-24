import { create } from 'zustand';
import type { Highlight } from './types';

interface HighlightUIState {
  selectedHighlight: Highlight | null;
  isEditMode: boolean;
  sortBy: 'date' | 'page' | 'book';
  filterBy: {
    favorite: boolean;
    bookId?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
  setSelectedHighlight: (highlight: Highlight | null) => void;
  setEditMode: (isEdit: boolean) => void;
  setSortBy: (sort: 'date' | 'page' | 'book') => void;
  setFilterBy: (filter: Partial<HighlightUIState['filterBy']>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS = {
  favorite: false,
};

export const useHighlightStore = create<HighlightUIState>((set) => ({
  // Initial state
  selectedHighlight: null,
  isEditMode: false,
  sortBy: 'date',
  filterBy: DEFAULT_FILTERS,

  // Actions
  setSelectedHighlight: (highlight) => set({ selectedHighlight: highlight }),
  setEditMode: (isEdit) => set({ isEditMode: isEdit }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setFilterBy: (filter) =>
    set((state) => ({
      filterBy: {
        ...state.filterBy,
        ...filter,
      },
    })),
  resetFilters: () => set({ filterBy: DEFAULT_FILTERS }),
}));
