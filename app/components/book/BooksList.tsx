import { useState } from 'react';
import { useBookStore } from '@/app/stores/useBookStore';
import { DeleteBookDialog } from '@/app/components/dialogs/DeleteBookDialog';
import BookCard from './BookCard';
import { ReadingStatusType } from '@/app/stores/types';
import { Button } from '@/app/components/ui/button';
import { Library, PlusCircle } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from '@/app/components/ui/drawer';
import { AddBookForm } from './AddBookForm';

function EmptyLibraryState() {
  const { isAddBookDrawerOpen, setAddBookDrawerOpen } = useBookStore();

  return (
    <div className="group rounded-lg border border-mono-subtle/40 bg-white p-8 shadow-sm transition-shadow hover:shadow-md max-w-lg w-full">
      <div className="text-center space-y-6">
        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
          <Library className="w-6 h-6 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Start Your Reading Journey</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Track your reading progress, collect meaningful highlights, and discover new books to read.
          </p>
        </div>
        <div className="flex justify-center">
          <Drawer open={isAddBookDrawerOpen} onOpenChange={setAddBookDrawerOpen}>
            <DrawerTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Your First Book
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[90vh] flex flex-col">
              <DrawerHeader className="flex-shrink-0">
                <DrawerTitle>Add New Book</DrawerTitle>
                <DrawerDescription>Start your reading journey by adding your first book.</DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 overflow-y-auto px-4 pb-8">
                <AddBookForm onCancel={() => setAddBookDrawerOpen(false)} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}

export function BooksList() {
  const { books, deleteBook, updateBookStatus } = useBookStore();
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (bookToDelete) {
      deleteBook(bookToDelete);
      setBookToDelete(null);
    }
  };

  const handleStatusChange = (bookId: string, status: ReadingStatusType) => {
    updateBookStatus(bookId, status);
  };

  if (books.length === 0) {
    return <EmptyLibraryState />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2" role="list" aria-label="Books list">
      {books.map((book) => (
        <div key={book.id} className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200" role="listitem">
          <BookCard
            book={book}
            onStatusChange={handleStatusChange}
            onDelete={(id) => setBookToDelete(id)}
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
