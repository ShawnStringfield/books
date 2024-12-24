import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import * as bookService from '@/app/lib/firebase/services/books';
import type { Book, BaseBook } from '@/app/stores/types';

// Collection and query keys as constants
const BOOKS_KEY = 'books';

export function useBooks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [BOOKS_KEY],
    queryFn: async () => {
      if (!user?.uid) {
        throw new Error('Authentication required to access books');
      }
      // Temporarily disable sorting until index is built
      return bookService.getBooks(user.uid);
    },
    enabled: !!user?.uid,
  });
}

export function useBook(bookId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [BOOKS_KEY, bookId],
    queryFn: async () => {
      if (!user?.uid) {
        throw new Error('Authentication required to access book');
      }
      return bookService.getBook(bookId);
    },
    enabled: !!user?.uid,
  });
}

export function useAddBook() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (book: BaseBook) => {
      if (!user?.uid) {
        throw new Error('Authentication required to add book');
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
    mutationFn: async ({ bookId, updates }: { bookId: string; updates: Partial<Book> }) => {
      if (!user?.uid) {
        throw new Error('Authentication required to update book');
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
        throw new Error('Authentication required to delete book');
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
    mutationFn: async ({ bookId, status }: { bookId: string; status: Book['status'] }) => {
      if (!user?.uid) {
        throw new Error('Authentication required to update reading status');
      }
      return bookService.updateReadingStatus(bookId, status);
    },
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY, bookId] });
    },
  });
}

export function useUpdateReadingProgress() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ bookId, currentPage }: { bookId: string; currentPage: number }) => {
      if (!user?.uid) {
        throw new Error('Authentication required to update reading progress');
      }
      return bookService.updateReadingProgress(bookId, currentPage);
    },
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY, bookId] });
    },
  });
}
