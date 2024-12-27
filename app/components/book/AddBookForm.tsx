"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/app/hooks/utils/useDebounce";
import {
  GoogleBook,
  GoogleBooksResponse,
  ReadingStatus,
} from "@/app/stores/types";
import Image from "next/image";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { useAddBook, useBooks } from "@/app/hooks/books/useBooks";
import { isDuplicateGoogleBook } from "@/app/lib/utils/bookUtils";

// Constants
const MAX_RESULTS = 10;

// Types
interface GoogleBooksError {
  error?: {
    code?: number;
    message: string;
    errors?: Array<{
      message: string;
      domain: string;
      reason: string;
    }>;
  };
}

interface AddBookFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

const fetchGoogleBooks = async (
  searchQuery: string,
  signal: AbortSignal
): Promise<GoogleBook[]> => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      searchQuery
    )}&maxResults=${MAX_RESULTS}`,
    { signal }
  );

  if (!response.ok) {
    const errorData: GoogleBooksError = await response.json();
    throw new Error(
      errorData.error?.message ||
        `API error: ${response.status} ${response.statusText}`
    );
  }

  const data: GoogleBooksResponse = await response.json();
  return data.items || [];
};

export function AddBookForm({ onSuccess, onCancel }: AddBookFormProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);
  const [addAsInProgress, setAddAsInProgress] = useState(true);
  const debouncedQuery = useDebounce(query, 500);
  const addBookMutation = useAddBook();
  const { data: existingBooks = [] } = useBooks();

  const handleSearchError = useCallback((err: unknown) => {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Network error while searching books";
    setError(errorMessage);
    setBooks([]);
  }, []);

  const searchBooks = useCallback(
    async (controller: AbortController) => {
      if (!debouncedQuery.trim()) {
        setBooks([]);
        setIsFirstLoad(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await fetchGoogleBooks(
          debouncedQuery,
          controller.signal
        );
        setBooks(results);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Ignore abort errors
        }
        handleSearchError(err);
      } finally {
        setIsLoading(false);
        setIsFirstLoad(false);
      }
    },
    [debouncedQuery, handleSearchError]
  );

  useEffect(() => {
    const controller = new AbortController();
    searchBooks(controller);
    return () => controller.abort();
  }, [debouncedQuery, searchBooks]);

  const validateAndPrepareBook = (book: GoogleBook) => {
    const volumeInfo = book.volumeInfo;

    if (isDuplicateGoogleBook(existingBooks, volumeInfo)) {
      throw new Error("This book is already in your library");
    }

    return {
      title: volumeInfo.title,
      ...(volumeInfo.subtitle ? { subtitle: volumeInfo.subtitle } : {}),
      author: volumeInfo.authors?.[0] || "Unknown Author",
      totalPages: volumeInfo.pageCount || 0,
      currentPage: addAsInProgress ? 1 : 0,
      status: addAsInProgress
        ? ReadingStatus.IN_PROGRESS
        : ReadingStatus.NOT_STARTED,
      ...(addAsInProgress ? { startDate: new Date().toISOString() } : {}),
      categories: volumeInfo.categories || [],
      previewLink: volumeInfo.previewLink,
      infoLink: volumeInfo.infoLink,
      description: volumeInfo.description || "",
      genre: volumeInfo.categories?.[0] || "Unknown",
      isbn: volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")
        ?.identifier,
      publisher: volumeInfo.publisher || "Unknown Publisher",
      coverUrl:
        volumeInfo.imageLinks?.thumbnail ||
        volumeInfo.imageLinks?.smallThumbnail,
      fromGoogle: true,
    };
  };

  const handleAddBook = async () => {
    if (!selectedBook) return;

    try {
      const newBook = validateAndPrepareBook(selectedBook);
      await addBookMutation.mutateAsync(newBook);
      onSuccess?.();
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add book");
    }
  };

  const renderSearchResults = () => (
    <div
      aria-live="polite"
      className="divide-y"
      role="region"
      aria-label="Search results"
    >
      {books.map((book) => (
        <button
          key={book.id}
          onClick={() => setSelectedBook(book)}
          className="w-full text-left py-4 hover:bg-gray-50 transition-colors first:pt-2 last:pb-2"
          aria-label={`Select ${book.volumeInfo.title} by ${
            book.volumeInfo.authors?.[0] || "Unknown Author"
          }`}
        >
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              {book.volumeInfo.imageLinks?.thumbnail && (
                <Image
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  width={50}
                  height={75}
                  className="rounded shadow-sm h-auto"
                />
              )}
            </div>
            <div>
              <h3 className="font-medium">{book.volumeInfo.title}</h3>
              {book.volumeInfo.subtitle && (
                <p className="text-sm text-gray-600">
                  {book.volumeInfo.subtitle}
                </p>
              )}
              <p className="text-sm text-gray-600">
                {book.volumeInfo.authors?.join(", ")}
              </p>
              {book.volumeInfo.pageCount && (
                <p className="text-sm text-gray-600">
                  {book.volumeInfo.pageCount} pages
                </p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderSelectedBook = () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {selectedBook?.volumeInfo.imageLinks?.thumbnail && (
            <Image
              src={selectedBook.volumeInfo.imageLinks.thumbnail}
              alt={selectedBook.volumeInfo.title}
              width={80}
              height={120}
              className="rounded shadow-sm h-auto"
            />
          )}
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold">{selectedBook?.volumeInfo.title}</h3>
          {selectedBook?.volumeInfo.subtitle && (
            <p className="text-sm text-gray-600">
              {selectedBook.volumeInfo.subtitle}
            </p>
          )}
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p>{selectedBook?.volumeInfo.authors?.join(", ")}</p>
            {selectedBook?.volumeInfo.pageCount && (
              <div className="flex items-center gap-2">
                <span>{selectedBook.volumeInfo.pageCount} pages</span>
              </div>
            )}
            <p className="truncate">{selectedBook?.volumeInfo.publisher}</p>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {selectedBook?.volumeInfo.description && (
        <p className="text-sm text-gray-600 line-clamp-2">
          {selectedBook.volumeInfo.description}
        </p>
      )}

      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <input
          type="checkbox"
          id="addAsInProgress"
          checked={addAsInProgress}
          onChange={(e) => setAddAsInProgress(e.target.checked)}
          className="h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="addAsInProgress"
          className="text-sm font-medium text-blue-900"
        >
          Add to &ldquo;Currently Reading&rdquo;
        </label>
      </div>

      {selectedBook?.volumeInfo.categories && (
        <div className="flex gap-1.5 flex-wrap">
          {selectedBook.volumeInfo.categories.map((category) => (
            <span
              key={category}
              className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
            >
              {category}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={() => setSelectedBook(null)}>
          Back to Search
        </Button>
        <Button onClick={handleAddBook} disabled={addBookMutation.isPending}>
          {addBookMutation.isPending ? "Adding..." : "Add Book"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          aria-label="Search books"
        />
      </div>

      {error && (
        <div
          className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg"
          role="alert"
        >
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">
          <div
            className={`animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto ${
              !isFirstLoad ? "opacity-50" : ""
            }`}
            role="progressbar"
            aria-label="Searching books"
          />
        </div>
      ) : selectedBook ? (
        renderSelectedBook()
      ) : (
        renderSearchResults()
      )}
    </div>
  );
}
