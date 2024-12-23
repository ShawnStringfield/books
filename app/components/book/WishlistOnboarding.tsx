import { BookMarked, Plus, Search } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import { Book } from '@/app/stores/types';

const WishlistOnboarding = () => {
  // For now, just set wishlist to empty array
  const wishlist: Book[] = [];

  const handleAddToWishlist = () => {
    // setIsWishlistModalOpen(true);
  };

  return (
    <div className="group rounded-lg border border-mono-subtle/40 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
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
    </div>
  );
};

function EmptyWishlistState({ onAddToWishlist }: { onAddToWishlist: () => void }) {
  return (
    <div className="text-center space-y-4">
      <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
        <Search className="w-6 h-6 text-gray-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Build Your Wishlist</h3>
        <p className="text-sm text-gray-600 max-w-xs mx-auto">
          {`Keep track of books you'd like to read in the future. Add books to your wishlist to never forget your next read.`}
        </p>
      </div>
      <Button variant="outline" onClick={onAddToWishlist} className="flex items-center justify-center w-10 h-10 rounded-full mx-auto">
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default WishlistOnboarding;
