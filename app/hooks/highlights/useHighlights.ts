import { useAuth } from "@/app/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as highlightService from "@/app/lib/firebase/services/highlights";
import type { BaseHighlight, Highlight } from "@/app/stores/types";
import { useEffect, useState } from "react";

// Query keys as constants
const HIGHLIGHTS_KEY = "highlights";
const BOOK_KEY = "book";
const FAVORITES_KEY = "favorites";

export function useHighlights() {
  const { user } = useAuth();
  const [data, setData] = useState<Highlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = highlightService.subscribeToHighlights(
      user.uid,
      (highlights) => {
        setData(highlights);
        setIsLoading(false);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { data, isLoading, error };
}

export function useHighlightsByBook(bookId: string, limit?: number) {
  const { user } = useAuth();
  const [data, setData] = useState<Highlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user || !bookId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = highlightService.subscribeToHighlightsByBook(
      user.uid,
      bookId,
      (highlights) => {
        setData(highlights);
        setIsLoading(false);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
      },
      limit
    );

    return () => unsubscribe();
  }, [user, bookId, limit]);

  return { data, isLoading, error };
}

export function useFavoriteHighlights() {
  const { user } = useAuth();
  const [data, setData] = useState<Highlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = highlightService.subscribeToFavoriteHighlights(
      user.uid,
      (highlights) => {
        setData(highlights);
        setIsLoading(false);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { data, isLoading, error };
}

export function useAddHighlight() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (highlight: BaseHighlight) => {
      console.log("Adding new highlight:", highlight);
      if (!user)
        throw new Error("User must be authenticated to add highlights");
      try {
        const result = await highlightService.addHighlight(user.uid, highlight);
        console.log("Successfully added highlight:", result);
        return result;
      } catch (error) {
        console.error("Error adding highlight:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      console.log("Invalidating queries after successful highlight addition");
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY] });
      queryClient.invalidateQueries({
        queryKey: [HIGHLIGHTS_KEY, BOOK_KEY, variables.bookId],
      });
    },
    onError: (error) => {
      console.error("Mutation error in useAddHighlight:", error);
    },
  });
}

export function useUpdateHighlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      highlightId,
      updates,
    }: {
      highlightId: string;
      updates: Partial<BaseHighlight>;
    }) => highlightService.updateHighlight(highlightId, updates),
    onMutate: async ({ highlightId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [HIGHLIGHTS_KEY] });

      // Snapshot the previous value
      const previousHighlights = queryClient.getQueryData([HIGHLIGHTS_KEY]);

      // Optimistically update the cache
      queryClient.setQueryData([HIGHLIGHTS_KEY], (old: Highlight[] = []) => {
        return old?.map((highlight) =>
          highlight.id === highlightId
            ? { ...highlight, ...updates }
            : highlight
        );
      });

      return { previousHighlights };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousHighlights) {
        queryClient.setQueryData([HIGHLIGHTS_KEY], context.previousHighlights);
      }
    },
    onSettled: (_, __, { updates }) => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY] });
      if (updates.bookId) {
        queryClient.invalidateQueries({
          queryKey: [HIGHLIGHTS_KEY, BOOK_KEY, updates.bookId],
        });
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      highlightId,
      isFavorite,
    }: {
      highlightId: string;
      isFavorite: boolean;
      bookId: string;
    }) => {
      if (!user) {
        throw new Error("User must be authenticated to toggle favorite");
      }
      return highlightService.toggleFavorite(highlightId, isFavorite);
    },
    onMutate: async ({ highlightId, isFavorite }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [HIGHLIGHTS_KEY] });
      await queryClient.cancelQueries({ queryKey: [FAVORITES_KEY] });

      // Snapshot the previous values
      const previousHighlights =
        queryClient.getQueryData<Highlight[]>([HIGHLIGHTS_KEY]) || [];
      const previousFavorites =
        queryClient.getQueryData<Highlight[]>([
          HIGHLIGHTS_KEY,
          FAVORITES_KEY,
        ]) || [];

      // Optimistically update highlights cache
      queryClient.setQueryData<Highlight[]>([HIGHLIGHTS_KEY], (old = []) => {
        return old.map((highlight) =>
          highlight.id === highlightId
            ? { ...highlight, isFavorite }
            : highlight
        );
      });

      // Optimistically update favorites cache
      queryClient.setQueryData<Highlight[]>(
        [HIGHLIGHTS_KEY, FAVORITES_KEY],
        (old = []) => {
          if (isFavorite) {
            const highlight = previousHighlights.find(
              (h) => h.id === highlightId
            );
            return highlight ? [...old, highlight] : old;
          } else {
            return old.filter((highlight) => highlight.id !== highlightId);
          }
        }
      );

      return { previousHighlights, previousFavorites };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, roll back both caches
      if (context?.previousHighlights) {
        queryClient.setQueryData([HIGHLIGHTS_KEY], context.previousHighlights);
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          [HIGHLIGHTS_KEY, FAVORITES_KEY],
          context.previousFavorites
        );
      }
    },
    onSettled: (_, __, { bookId }) => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [FAVORITES_KEY] });
      queryClient.invalidateQueries({
        queryKey: [HIGHLIGHTS_KEY, BOOK_KEY, bookId],
      });
    },
  });
}

export function useHighlightActions() {
  const toggleFavorite = useToggleFavorite();

  return {
    toggleFavorite,
  };
}
