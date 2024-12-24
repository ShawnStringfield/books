import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import * as bookService from '@/app/lib/firebase/services/books';
import type { Book } from '@/app/stores/types';

// Query keys as constants
const BOOKS_KEY = 'books';

export function useBooks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [BOOKS_KEY],
    queryFn: () => bookService.getBooks(user!.uid),
    enabled: !!user,
  });
}

export function useBook(bookId: string) {
  return useQuery({
    queryKey: [BOOKS_KEY, bookId],
    queryFn: () => bookService.getBook(bookId),
  });
}

export function useAddBook() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (book: Omit<Book, 'id'>) => bookService.addBook(user!.uid, book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, updates }: { bookId: string; updates: Partial<Book> }) => bookService.updateBook(bookId, updates),
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY, bookId] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookService.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
    },
  });
}

export function useUpdateReadingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, status }: { bookId: string; status: Book['status'] }) => bookService.updateReadingStatus(bookId, status),
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY, bookId] });
    },
  });
}

export function useUpdateReadingProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, currentPage }: { bookId: string; currentPage: number }) => bookService.updateReadingProgress(bookId, currentPage),
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY, bookId] });
    },
  });
}
