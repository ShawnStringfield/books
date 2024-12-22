'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/app/hooks/useDebounce';
import { GoogleBook, GoogleBooksResponse, ReadingStatus } from '@/app/stores/types';
import Image from 'next/image';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { useBookStore } from '@/app/stores/useBookStore';
import { v4 as uuidv4 } from 'uuid';
import { Separator } from '@/app/components/ui/separator';

interface AddBookFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

export function AddBookForm({ onSuccess, onCancel }: AddBookFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [addAsInProgress, setAddAsInProgress] = useState(false);

  const { addBook, setLoading, isLoading, books } = useBookStore();

  // Search functionality
  useEffect(() => {
    const searchBooks = async () => {
      if (!debouncedSearch) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(debouncedSearch)}&maxResults=5`);
        const data: GoogleBooksResponse = await response.json();
        setSearchResults(data.items || []);
      } catch (error) {
        console.error('Failed to search books:', error);
      } finally {
        setIsSearching(false);
      }
    };

    searchBooks();
  }, [debouncedSearch]);

  const handleBookSelect = (book: GoogleBook) => {
    setSelectedBook(book);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAddBook = async () => {
    if (!selectedBook) return;

    try {
      setLoading(true);
      setError(null);

      const bookData = {
        title: selectedBook.volumeInfo.title,
        subtitle: selectedBook.volumeInfo.subtitle || '',
        author: selectedBook.volumeInfo.authors?.[0] || 'Unknown Author',
        totalPages: selectedBook.volumeInfo.pageCount || 0,
        coverUrl: selectedBook.volumeInfo.imageLinks?.thumbnail || '',
        description: selectedBook.volumeInfo.description || '',
        publisher: selectedBook.volumeInfo.publisher || '',
        previewLink: selectedBook.volumeInfo.previewLink || '',
        infoLink: selectedBook.volumeInfo.infoLink || '',
        categories: selectedBook.volumeInfo.categories || [],
        isbn:
          selectedBook.volumeInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier ||
          selectedBook.volumeInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_10')?.identifier ||
          '',
      };

      // Check for duplicates
      const isDuplicate = books.some((book) => {
        if (bookData.isbn && book.isbn) {
          return bookData.isbn === book.isbn;
        }
        return book.title.toLowerCase() === bookData.title.toLowerCase() && book.author?.toLowerCase() === bookData.author.toLowerCase();
      });

      if (isDuplicate) {
        setError('This book already exists in your collection');
        return;
      }

      const newBook = {
        id: uuidv4(),
        ...bookData,
        createdAt: new Date().toISOString(),
        completedDate: undefined,
        currentPage: 0,
        status: addAsInProgress ? ReadingStatus.IN_PROGRESS : ReadingStatus.NOT_STARTED,
        startDate: addAsInProgress ? new Date().toISOString() : undefined,
        highlights: [],
        genre: (bookData.categories && bookData.categories[0]) || 'Unknown',
      };

      addBook(newBook);
      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Add New Book</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>}

      <div className="relative">
        <Input placeholder="Search for a book..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10" autoFocus />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

        {searchResults.length > 0 && !selectedBook && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-[300px] overflow-y-auto">
            {searchResults.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => handleBookSelect(book)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
              >
                {book.volumeInfo.imageLinks?.thumbnail && (
                  <Image src={book.volumeInfo.imageLinks.thumbnail} alt="" width={40} height={56} className="object-cover" />
                )}
                <div>
                  <p className="font-medium">{book.volumeInfo.title}</p>
                  <p className="text-sm text-gray-600">{book.volumeInfo.authors?.[0]}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {isSearching && (
          <div className="absolute z-10 w-full mt-1 p-4 bg-white rounded-md shadow-lg border border-gray-200 text-center text-sm">Searching...</div>
        )}
      </div>

      {selectedBook && (
        <div className="space-y-4">
          <div className="flex gap-4">
            {selectedBook.volumeInfo.imageLinks?.thumbnail && (
              <Image src={selectedBook.volumeInfo.imageLinks.thumbnail} alt="" width={80} height={120} className="object-cover rounded-md" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{selectedBook.volumeInfo.title}</h3>
              {selectedBook.volumeInfo.subtitle && <p className="text-gray-600 text-sm truncate">{selectedBook.volumeInfo.subtitle}</p>}
              <p className="text-gray-600 text-sm">By {selectedBook.volumeInfo.authors?.[0] || 'Unknown Author'}</p>
              <div className="mt-1 text-sm text-gray-500">
                <p>{selectedBook.volumeInfo.pageCount || 0} pages</p>
                <p className="truncate">{selectedBook.volumeInfo.publisher}</p>
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          {selectedBook.volumeInfo.description && <p className="text-sm text-gray-600 line-clamp-2">{selectedBook.volumeInfo.description}</p>}

          {selectedBook.volumeInfo.categories && (
            <div className="flex gap-1.5 flex-wrap">
              {selectedBook.volumeInfo.categories.map((category) => (
                <span key={category} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                  {category}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="addAsInProgress"
              checked={addAsInProgress}
              onChange={(e) => setAddAsInProgress(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="addAsInProgress" className="text-sm text-gray-600">
              Add as &ldquo;Currently Reading&rdquo;
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedBook(null);
                setSearchQuery('');
                setAddAsInProgress(false);
              }}
              disabled={isLoading}
            >
              Back to Search
            </Button>
            <Button type="button" size="sm" onClick={handleAddBook} disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add to Library'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
