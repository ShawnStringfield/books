import { useState } from 'react';
import { useDashboardStore, selectIsLastBook } from '../stores/useDashboardStore';
import { DeleteBookDialog } from './DeleteBookDialog';
import { Button } from '@/app/components/ui/button';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function BooksList() {
  const { books, deleteBook } = useDashboardStore();
  const isLastBook = useDashboardStore(selectIsLastBook);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (bookToDelete && !isLastBook) {
      deleteBook(bookToDelete);
      setBookToDelete(null);
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No books added yet. Start by adding your first book!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Books list">
      {books.map((book) => (
        <div key={book.id} className="relative group border rounded-lg p-4 hover:shadow-md transition-shadow" role="listitem">
          <Link
            href={`/dashboard/books/${book.id}`}
            className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg"
          >
            <div className="flex gap-4">
              {book.coverUrl ? (
                <div className="flex-shrink-0 w-[80px] h-[120px] relative">
                  <Image
                    src={book.coverUrl}
                    alt="" // Moving book title to aria-label for better screen reader experience
                    fill
                    className="object-cover rounded"
                    sizes="80px"
                    aria-label={`Cover of ${book.title}`}
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 w-[80px] h-[120px] bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-400">No cover</span>
                </div>
              )}
              <div className="flex-grow">
                <h3 className="font-medium line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-1">{book.author}</p>
                <div className="text-sm text-gray-500 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-grow bg-gray-200 h-2 rounded-full">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.round((book.currentPage / book.totalPages) * 100)}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round((book.currentPage / book.totalPages) * 100)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    <span className="flex-shrink-0">{Math.round((book.currentPage / book.totalPages) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setBookToDelete(book.id);
            }}
            disabled={isLastBook}
            aria-label={`Delete ${book.title}${isLastBook ? ' (Cannot delete last book)' : ''}`}
            title={isLastBook ? 'Cannot delete the last book' : undefined}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <DeleteBookDialog
        isOpen={!!bookToDelete}
        onClose={() => setBookToDelete(null)}
        onConfirm={handleDelete}
        bookTitle={books.find((b) => b.id === bookToDelete)?.title || ''}
      />
    </div>
  );
}
