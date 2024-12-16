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
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2" role="list" aria-label="Books list">
      {books.map((book) => (
        <div key={book.id} className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200" role="listitem">
          <BookCard
            book={book}
            onStatusChange={handleStatusChange}
            progressDisplay="compact"
            className="group-hover:border-blue-200 transition-colors duration-200"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 
              opacity-0 group-hover:opacity-100 focus:opacity-100
              text-red-500 hover:text-red-700 hover:bg-red-50/80 
              disabled:opacity-50 transition-opacity duration-200 z-10"
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
