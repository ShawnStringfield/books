import { useState } from 'react';
import { useDashboardStore, selectIsLastBook } from '../stores/useDashboardStore';
import { DeleteBookDialog } from './DeleteBookDialog';
import { Button } from '@/app/components/ui/button';
import { Trash2 } from 'lucide-react';
import BookCard from './BookCard';
import { ReadingStatus } from '../types/books';

export function BooksList() {
  const { books, deleteBook, updateBookStatus } = useDashboardStore();
  const isLastBook = useDashboardStore(selectIsLastBook);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (bookToDelete && !isLastBook) {
      deleteBook(bookToDelete);
      setBookToDelete(null);
    }
  };

  const handleStatusChange = (bookId: string, status: ReadingStatus) => {
    updateBookStatus(bookId, status);
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No books added yet. Start by adding your first book!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2" role="list" aria-label="Books list">
      {books.map((book) => (
        <div key={book.id} className="relative group" role="listitem">
          <BookCard book={book} onStatusChange={handleStatusChange} className="group-hover:border-blue-200" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 
              /* Show by default on mobile, use opacity for larger screens */
              md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100
              text-red-500 hover:text-red-700 hover:bg-red-50 
              disabled:opacity-50 z-10"
            onClick={() => setBookToDelete(book.id)}
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
