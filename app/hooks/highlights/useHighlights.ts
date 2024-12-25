import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import * as highlightService from '@/app/lib/firebase/services/highlights';
import type { BaseHighlight } from '@/app/stores/types';

// Query keys as constants
const HIGHLIGHTS_KEY = 'highlights';
const BOOK_KEY = 'book';
const FAVORITES_KEY = 'favorites';

export function useHighlights() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: [HIGHLIGHTS_KEY],
    queryFn: async () => {
      console.log('Fetching all highlights for user:', user?.uid);
      try {
        const highlights = await highlightService.getHighlights(user!.uid);
        console.log('Successfully fetched highlights:', highlights);
        return highlights;
      } catch (error) {
        console.error('Error fetching highlights:', error);
        throw error;
      }
    },
    enabled: !!user,
  });

  console.log('useHighlights query state:', {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    data: query.data,
  });

  return query;
}

export function useHighlightsByBook(bookId: string, limit?: number) {
  const { user } = useAuth();

  console.log('useHighlightsByBook called with:', {
    bookId,
    isAuthenticated: !!user,
    userId: user?.uid,
    limit,
  });

  const query = useQuery({
    queryKey: [HIGHLIGHTS_KEY, BOOK_KEY, bookId, limit],
    queryFn: async () => {
      console.log('Fetching highlights for book:', {
        bookId,
        userId: user!.uid,
        limit,
      });

      try {
        const highlights = await highlightService.getHighlightsByBook(user!.uid, bookId, limit);
        console.log('Fetched highlights:', highlights);
        return highlights;
      } catch (error) {
        console.error('Error fetching highlights:', error);
        throw error;
      }
    },
    enabled: !!user && !!bookId,
  });

  console.log('useHighlightsByBook query state:', {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    data: query.data,
  });

  return query;
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
    mutationFn: async (highlight: BaseHighlight) => {
      console.log('Adding new highlight:', highlight);
      if (!user) throw new Error('User must be authenticated to add highlights');
      try {
        const result = await highlightService.addHighlight(user.uid, highlight);
        console.log('Successfully added highlight:', result);
        return result;
      } catch (error) {
        console.error('Error adding highlight:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      console.log('Invalidating queries after successful highlight addition');
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY, BOOK_KEY, variables.bookId] });
    },
    onError: (error) => {
      console.error('Mutation error in useAddHighlight:', error);
    },
  });
}

export function useUpdateHighlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ highlightId, updates }: { highlightId: string; updates: Partial<BaseHighlight> }) =>
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
