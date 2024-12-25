import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import * as bookService from "@/app/lib/firebase/services/books";
import type { Book, BaseBook } from "@/app/stores/types";

// Collection and query keys as constants
const BOOKS_KEY = "books";

export function useBooks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [BOOKS_KEY],
    queryFn: async () => {
      if (!user?.uid) {
        throw new Error("Authentication required to fetch books");
      }
      return bookService.getBooks(user.uid);
    },
    gcTime: 24 * 60 * 60 * 1000, // Keep in cache for 24 hours
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true, // Refetch when coming back online
    retry: 1,
    networkMode: "offlineFirst", // Use cached data first, then update from network
  });
}

export function useBook(bookId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useQuery({
    queryKey: [BOOKS_KEY, bookId],
    queryFn: async () => {
      if (!user?.uid) {
        throw new Error("Authentication required to fetch book");
      }
      return bookService.getBook(bookId);
    },
    gcTime: 24 * 60 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
    networkMode: "offlineFirst",
    placeholderData: () => {
      // Try to get book from books list cache first
      const books = queryClient.getQueryData<Book[]>([BOOKS_KEY]);
      return books?.find((book) => book.id === bookId);
    },
  });
}

export function useAddBook() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (book: BaseBook) => {
      if (!user?.uid) {
        throw new Error("Authentication required to add book");
      }
      return bookService.addBook(user.uid, book);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      bookId,
      updates,
    }: {
      bookId: string;
      updates: Partial<Book>;
    }) => {
      if (!user?.uid) {
        throw new Error("Authentication required to update book");
      }
      return bookService.updateBook(bookId, updates);
    },
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY, bookId] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (bookId: string) => {
      if (!user?.uid) {
        throw new Error("Authentication required to delete book");
      }
      return bookService.deleteBook(bookId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
    },
  });
}

export function useUpdateReadingStatus() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      bookId,
      status,
    }: {
      bookId: string;
      status: Book["status"];
    }) => {
      if (!user?.uid) {
        throw new Error("Authentication required to update reading status");
      }
      return bookService.updateReadingStatus(bookId, status);
    },
    onMutate: async ({ bookId, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [BOOKS_KEY] });
      await queryClient.cancelQueries({ queryKey: [BOOKS_KEY, bookId] });

      // Snapshot the previous value
      const previousBooks = queryClient.getQueryData<Book[]>([BOOKS_KEY]);
      const previousBook = queryClient.getQueryData<Book>([BOOKS_KEY, bookId]);

      // Optimistically update the cache
      if (previousBooks) {
        queryClient.setQueryData<Book[]>([BOOKS_KEY], (old) =>
          old?.map((book) => (book.id === bookId ? { ...book, status } : book))
        );
      }

      if (previousBook) {
        queryClient.setQueryData<Book>([BOOKS_KEY, bookId], (old) =>
          old ? { ...old, status } : old
        );
      }

      return { previousBooks, previousBook };
    },
    onError: (err, { bookId }, context) => {
      // Revert the optimistic update on error
      if (context?.previousBooks) {
        queryClient.setQueryData([BOOKS_KEY], context.previousBooks);
      }
      if (context?.previousBook) {
        queryClient.setQueryData([BOOKS_KEY, bookId], context.previousBook);
      }
    },
    onSettled: (_, __, { bookId }) => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY, bookId] });
    },
  });
}

export function useUpdateReadingProgress() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      bookId,
      currentPage,
    }: {
      bookId: string;
      currentPage: number;
    }) => {
      if (!user?.uid) {
        throw new Error("Authentication required to update reading progress");
      }
      return bookService.updateReadingProgress(bookId, currentPage);
    },
    onMutate: async ({ bookId, currentPage }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [BOOKS_KEY] });
      await queryClient.cancelQueries({ queryKey: [BOOKS_KEY, bookId] });

      // Snapshot the previous value
      const previousBooks = queryClient.getQueryData<Book[]>([BOOKS_KEY]);
      const previousBook = queryClient.getQueryData<Book>([BOOKS_KEY, bookId]);

      // Optimistically update the cache
      if (previousBooks) {
        queryClient.setQueryData<Book[]>([BOOKS_KEY], (old) =>
          old?.map((book) =>
            book.id === bookId ? { ...book, currentPage } : book
          )
        );
      }

      if (previousBook) {
        queryClient.setQueryData<Book>([BOOKS_KEY, bookId], (old) =>
          old ? { ...old, currentPage } : old
        );
      }

      return { previousBooks, previousBook };
    },
    onError: (err, { bookId }, context) => {
      // Revert the optimistic update on error
      if (context?.previousBooks) {
        queryClient.setQueryData([BOOKS_KEY], context.previousBooks);
      }
      if (context?.previousBook) {
        queryClient.setQueryData([BOOKS_KEY, bookId], context.previousBook);
      }
    },
    onSettled: (_, __, { bookId }) => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY, bookId] });
    },
  });
}
