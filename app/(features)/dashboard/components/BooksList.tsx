import { useState } from 'react';
import { useDashboardStore } from '../stores/useDashboardStore';
import { DeleteBookDialog } from './DeleteBookDialog';
import { Button } from '@/app/components/ui/button';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function BooksList() {
  const { books, deleteBook } = useDashboardStore();
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (bookToDelete) {
      deleteBook(bookToDelete);
      setBookToDelete(null);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <div key={book.id} className="relative group border rounded-lg p-4 hover:shadow-md transition-shadow">
          <Link href={`/dashboard/books/${book.id}`} className="block">
            <div className="flex gap-4">
              {book.coverUrl && <Image src={book.coverUrl} alt={book.title} width={80} height={120} className="object-cover rounded" />}
              <div>
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-sm text-gray-500 mt-2">Progress: {Math.round((book.currentPage / book.totalPages) * 100)}%</p>
              </div>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.preventDefault();
              setBookToDelete(book.id);
            }}
            aria-label={`Delete ${book.title}`}
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
