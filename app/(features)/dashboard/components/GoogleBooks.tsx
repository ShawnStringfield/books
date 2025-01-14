import { useQuery } from "@tanstack/react-query";
import { useSelectedGenres } from "../../profile-onboarding/hooks/useOnboardingStore";
import Image from "next/image";

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

const fetchBooksForGenre = async (genre: string): Promise<BookItem[]> => {
  const response = await fetch(
    `/api/books/search?genre=${encodeURIComponent(genre)}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch books for genre: ${genre}`);
  }
  const data: BooksResponse = await response.json();
  return data.items || [];
};

const GoogleBooks = () => {
  const selectedGenres = useSelectedGenres();
  const genresToFetch =
    selectedGenres.length > 0 ? selectedGenres : ["fiction"];

  const {
    data: books = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["books", genresToFetch],
    queryFn: async () => {
      const bookResults = await Promise.all(
        genresToFetch.map(fetchBooksForGenre),
      );
      return bookResults.flat().sort(() => Math.random() - 0.5);
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes
  });

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
        <p>{error instanceof Error ? error.message : "An error occurred"}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Recommended Books</h1>
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedGenres.map((genre: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {genre}
            </span>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <div
            key={book.id || index}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {book.volumeInfo.imageLinks && (
              <Image
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={`Cover of ${book.volumeInfo.title}`}
                width={128}
                height={192}
                className="w-auto h-auto max-h-[192px] object-contain mb-4 mx-auto"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">
              {book.volumeInfo.title}
            </h2>
            {book.volumeInfo.authors && (
              <p className="text-gray-600 mb-2">
                By {book.volumeInfo.authors.join(", ")}
              </p>
            )}
            {book.volumeInfo.categories && (
              <div className="flex flex-wrap gap-2 mb-2">
                {book.volumeInfo.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
            {book.volumeInfo.description && (
              <p className="text-gray-700 line-clamp-3">
                {book.volumeInfo.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleBooks;
