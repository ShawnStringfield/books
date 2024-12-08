import { useEffect, useState } from 'react';

import { useSelectedGenres } from '../../profile-onboarding/hooks/useOnboardingStore';
import Image from 'next/image';

interface BookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
    publishedDate?: string;
    categories?: string[];
  };
}

interface BooksResponse {
  items: BookItem[];
  totalItems: number;
}

const GoogleBooks = () => {
  const selectedGenres = useSelectedGenres();
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooksForGenre = async (genre: string) => {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${'fiction'}&maxResults=4&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch books for genre: ${genre}`);
      }

      const data: BooksResponse = await response.json();
      return data.items || [];
    };

    const fetchAllBooks = async () => {
      try {
        // Use default genre if none selected
        const genresToFetch = selectedGenres.length > 0 ? selectedGenres : ['fiction'];

        // Fetch books for all genres in parallel
        const bookResults = await Promise.all(genresToFetch.map(fetchBooksForGenre));

        // Combine and shuffle all books
        const allBooks = bookResults.flat();
        const shuffledBooks = allBooks.sort(() => Math.random() - 0.5);

        setBooks(shuffledBooks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBooks();
  }, [selectedGenres]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md" role="alert">
        <h2 className="text-lg font-semibold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Recommended Books</h1>
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedGenres.map((genre, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {genre}
            </span>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {book.volumeInfo.imageLinks && (
              <Image
                key={book.id}
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={`Cover of ${book.volumeInfo.title}`}
                width={200}
                height={192} // 48rem = 192px
                className="w-full h-48 object-contain mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{book.volumeInfo.title}</h2>
            {book.volumeInfo.authors && <p className="text-gray-600 mb-2">By {book.volumeInfo.authors.join(', ')}</p>}
            {book.volumeInfo.categories && (
              <div className="flex flex-wrap gap-2 mb-2">
                {book.volumeInfo.categories.map((category, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {category}
                  </span>
                ))}
              </div>
            )}
            {book.volumeInfo.description && <p className="text-gray-700 line-clamp-3">{book.volumeInfo.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleBooks;
