import { useCallback } from 'react';
import { useBookStore, selectRecentHighlightsData, BookStore } from '../stores/useBookStore';

export const useRecentHighlights = (limit: number = 5) => {
  return useBookStore(useCallback((state: BookStore) => selectRecentHighlightsData(state, limit), [limit]));
};
