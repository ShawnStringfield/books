import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Heart } from 'lucide-react';
import { useBookStore, type BookStore } from '@/app/(features)/dashboard/stores/useBookStore';
import { useEffect, useState } from 'react';

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
    <Card className="my-4">
      <CardContent>
        {favoriteHighlights.length > 0 ? (
          <div className="space-y-4">
            {favoriteHighlights.slice(0, 3).map((highlight) => {
              const book = books.find((b) => b.id === highlight.bookId);
              return (
                <div key={highlight.id} className="border-l-2 border-yellow-400 pl-4">
                  <p className="italic">{highlight.text}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {book?.title} - Page {highlight.page}
                  </p>
                </div>
              );
            })}
            {favoriteHighlights.length > 3 && (
              <Button variant="link" className="text-sm w-full text-center">
                View all {favoriteHighlights.length} favorites
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
    <div className="text-center space-y-4 py-16 flex flex-col justify-center min-h-[300px]">
      <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
        <Heart className="w-6 h-6 text-gray-600" />
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
