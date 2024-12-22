import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Heart } from 'lucide-react';
import { useBookStore, type BookStore } from '@/app/stores/useBookStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <Card className="bg-gradient-to-br from-red-50 to-white border-none shadow-lg">
      <CardContent className="p-6">
        {favoriteHighlights.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Favorite Highlights
              </h2>
              <span className="text-sm text-gray-500">{favoriteHighlights.length} total</span>
            </div>
            <div className="space-y-4">
              {favoriteHighlights.slice(0, 3).map((highlight) => {
                const book = books.find((b) => b.id === highlight.bookId);
                return (
                  <div
                    key={highlight.id}
                    className="group rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <p className="text-gray-900 text-sm leading-normal">{highlight.text}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <Link href={`/dashboard/library/${highlight.bookId}`} className="font-medium hover:text-red-600 transition-colors">
                        {book?.title}
                      </Link>
                      <span>·</span>
                      <span>Page {highlight.page}</span>
                    </div>
                  </div>
                );
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
      </CardContent>
    </Card>
  );
};

function EmptyFavoritesState() {
  return (
    <div className="text-center space-y-4 py-12 flex flex-col justify-center min-h-[300px]">
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
