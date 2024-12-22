import { Button } from '@/app/components/ui/button';
import { Heart } from 'lucide-react';
import { useBookStore, type BookStore } from '@/app/stores/useBookStore';
import { useEffect, useState } from 'react';
import HighlightCard from './HighlightCard';

const FavHighlightsOnboarding = () => {
  const [favoriteHighlights, setFavoriteHighlights] = useState<BookStore['highlights']>([]);
  const [books, setBooks] = useState<BookStore['books']>([]);

  useEffect(() => {
    // Initial load
    const state = useBookStore.getState();
    setFavoriteHighlights(state.highlights.filter((h) => h.isFavorite));
    setBooks(state.books);

    // Subscribe to changes
    const unsubscribe = useBookStore.subscribe((state) => {
      setFavoriteHighlights(state.highlights.filter((h) => h.isFavorite));
      setBooks(state.books);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="my-16">
      {favoriteHighlights.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Favorite Highlights
            </h2>
            <span className="text-sm text-gray-500">{favoriteHighlights.length} total</span>
          </div>
          <div className="grid gap-4">
            {favoriteHighlights.slice(0, 3).map((highlight) => {
              const book = books.find((b) => b.id === highlight.bookId);
              const enrichedHighlight = {
                ...highlight,
                bookTitle: book?.title || '',
                bookAuthor: book?.author || '',
                bookTotalPages: book?.totalPages || 0,
                bookCurrentPage: book?.currentPage || 0,
                readingProgress: book ? Math.round((book.currentPage / book.totalPages) * 100) : 0,
              };
              return <HighlightCard key={highlight.id} highlight={enrichedHighlight} variant="verbose" />;
            })}
          </div>
          {favoriteHighlights.length > 3 && (
            <Button
              variant="outline"
              className="w-full text-sm font-medium text-gray-700 hover:bg-gray-50"
              aria-label={`View all ${favoriteHighlights.length} favorite highlights`}
            >
              View all favorites
            </Button>
          )}
        </div>
      ) : (
        <EmptyFavoritesState />
      )}
    </div>
  );
};

function EmptyFavoritesState() {
  return (
    <div className="text-center space-y-4 py-16 flex flex-col justify-center">
      <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
        <Heart className="w-6 h-6 text-red-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Save Your Favorite Highlights</h3>
        <p className="text-sm text-gray-600 max-w-xs mx-auto">
          Mark highlights as favorites while reading to keep your most meaningful quotes and insights in one place.
        </p>
      </div>
    </div>
  );
}

export default FavHighlightsOnboarding;
