import { BookMarked, List, Search } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  totalPages: number;
  currentPage?: number;
  startDate?: Date;
  completedDate?: Date;
}

interface Highlight {
  id: string;
  bookId: string;
  text: string;
  page: number;
  isFavorite: boolean;
  createdAt: Date;
}

interface DashboardStore {
  books: Book[];
  highlights: Highlight[];
  addBook: (book: Book) => void;
  addHighlight: (highlight: Highlight) => void;
  toggleFavoriteHighlight: (id: string) => void;
  updateReadingProgress: (bookId: string, currentPage: number) => void;
}

// Store
const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      books: [],
      highlights: [],
      addBook: (book) => set((state) => ({ books: [...state.books, book] })),
      addHighlight: (highlight) => set((state) => ({ highlights: [...state.highlights, highlight] })),
      toggleFavoriteHighlight: (id) =>
        set((state) => ({
          highlights: state.highlights.map((h) => (h.id === id ? { ...h, isFavorite: !h.isFavorite } : h)),
        })),
      updateReadingProgress: (bookId, currentPage) =>
        set((state) => ({
          books: state.books.map((b) => (b.id === bookId ? { ...b, currentPage } : b)),
        })),
    }),
    { name: 'dashboard-store' }
  )
);

const WishlistOnboarding = () => {
  const { books } = useDashboardStore();

  const wishlist = books.filter((b) => !b.startDate);

  const handleAddToWishlist = () => {
    // setIsWishlistModalOpen(true);
  };

  return (
    <Card className="my-16">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="w-5 h-5" />
          Wishlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        {wishlist.length > 0 ? (
          <div className="space-y-3">
            {wishlist.slice(0, 3).map((book) => (
              <div key={book.id} className="flex items-center gap-3">
                <BookMarked className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
              </div>
            ))}
            {wishlist.length > 3 && (
              <Button variant="link" className="text-sm pt-2">
                View all {wishlist.length} books
              </Button>
            )}
          </div>
        ) : (
          <EmptyWishlistState onAddToWishlist={handleAddToWishlist} />
        )}
      </CardContent>
    </Card>
  );
};

function EmptyWishlistState({ onAddToWishlist }: { onAddToWishlist: () => void }) {
  return (
    <div className="text-center space-y-4 py-6">
      <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
        <Search className="w-6 h-6 text-purple-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Build Your Wishlist</h3>
        <p className="text-sm text-gray-600 max-w-xs mx-auto">
          {`Keep track of books you'd like to read in the future. Add books to your wishlist to never forget your next read.`}
        </p>
      </div>
      <Button variant="outline" onClick={onAddToWishlist} className="flex items-center gap-2">
        <PlusCircle className="w-4 h-4" />
        Add to Wishlist
      </Button>
    </div>
  );
}

export default WishlistOnboarding;
