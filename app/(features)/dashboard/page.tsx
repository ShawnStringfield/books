'use client';

import { useOnboardingCheck } from '@/app/(features)/profile-onboarding/hooks/useOnboardingCheck';
import { useState, useEffect } from 'react';
import { BookVolume } from './types/books';
import Image from 'next/image';

export default function DashboardPage() {
  useOnboardingCheck();
  const [books, setBooks] = useState<BookVolume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=javascript&maxResults=10');

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        setBooks(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-4" role="alert">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow">
            {book.volumeInfo.imageLinks?.thumbnail && (
              <Image
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={`Cover of ${book.volumeInfo.title}`}
                width={128}
                height={192}
                className="mb-4 mx-auto"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{book.volumeInfo.title}</h2>
            {book.volumeInfo.authors && <p className="text-gray-600 mb-2">By {book.volumeInfo.authors.join(', ')}</p>}
            {book.volumeInfo.description && <p className="text-gray-700 line-clamp-3">{book.volumeInfo.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
