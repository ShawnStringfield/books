import { useState } from 'react';
import { useBookStore, selectIsLastBook } from '@/app/(features)/dashboard/stores/useBookStore';
import { DeleteBookDialog } from './DeleteBookDialog';
import BookCard from './BookCard';
import { ReadingStatus } from '@/app/(features)/dashboard/types/books';

export function BooksList() {
  const { books, deleteBook, updateBookStatus } = useBookStore();
  const isLastBook = useBookStore(selectIsLastBook);
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
            onDelete={(id) => setBookToDelete(id)}
            isLastBook={isLastBook}
            progressDisplay="compact"
            className="group-hover:border-blue-200 transition-colors duration-200"
          />
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
