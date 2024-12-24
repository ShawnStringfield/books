import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import * as highlightService from '@/app/lib/firebase/services/highlights';
import type { Highlight } from '@/app/stores/types';

// Query keys as constants
const HIGHLIGHTS_KEY = 'highlights';
const BOOK_KEY = 'book';
const FAVORITES_KEY = 'favorites';

export function useHighlights() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [HIGHLIGHTS_KEY],
    queryFn: () => highlightService.getHighlights(user!.uid),
    enabled: !!user,
  });
}

export function useHighlightsByBook(bookId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [HIGHLIGHTS_KEY, BOOK_KEY, bookId],
    queryFn: () => highlightService.getHighlightsByBook(user!.uid, bookId),
    enabled: !!user && !!bookId,
  });
}

export function useFavoriteHighlights() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [HIGHLIGHTS_KEY, FAVORITES_KEY],
    queryFn: () => highlightService.getFavoriteHighlights(user!.uid),
    enabled: !!user,
  });
}

export function useAddHighlight() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (highlight: Omit<Highlight, 'id'>) => highlightService.addHighlight(user!.uid, highlight),
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY, BOOK_KEY, bookId] });
    },
  });
}

export function useUpdateHighlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ highlightId, updates }: { highlightId: string; updates: Partial<Highlight> }) =>
      highlightService.updateHighlight(highlightId, updates),
    onSuccess: (_, { updates }) => {
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY] });
      if (updates.bookId) {
        queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY, BOOK_KEY, updates.bookId] });
      }
    },
  });
}

export function useDeleteHighlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: highlightService.deleteHighlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY] });
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ highlightId, isFavorite }: { highlightId: string; isFavorite: boolean }) =>
      highlightService.toggleFavorite(highlightId, isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY, FAVORITES_KEY] });
    },
  });
}
