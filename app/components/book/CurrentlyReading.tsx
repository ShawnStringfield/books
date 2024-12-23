import { Button } from '@/app/components/ui/button';
import { Library, PlusCircle } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from '@/app/components/ui/drawer';
import { AddBookForm } from './AddBookForm';
import { Book } from '@/app/stores/useBookStore';
import { useBookStore } from '@/app/stores/useBookStore';
import type { BookStore } from '@/app/stores/useBookStore';
import BookCard from './BookCard';
import { DeleteBookDialog } from '@/app/components/dialogs/DeleteBookDialog';
import { useState } from 'react';

interface CurrentlyReadingProps {
  books: Book[];
}

const CurrentlyReading = ({ books }: CurrentlyReadingProps) => {
  const updateBookStatus = useBookStore((state: BookStore) => state.updateBookStatus);
  const deleteBook = useBookStore((state: BookStore) => state.deleteBook);
  const allBooks = useBookStore((state: BookStore) => state.books);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (bookToDelete) {
      deleteBook(bookToDelete);
      setBookToDelete(null);
    }
  };

  return (
    <div className="space-y-4 my-16">
      {books.length > 0 ? (
        <>
          <div className={`grid gap-4 ${books.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onStatusChange={updateBookStatus}
                onDelete={(id) => setBookToDelete(id)}
                progressDisplay="compact"
              />
            ))}
          </div>

          <DeleteBookDialog
            isOpen={!!bookToDelete}
            onClose={() => setBookToDelete(null)}
            onConfirm={handleDelete}
            bookTitle={books.find((b) => b.id === bookToDelete)?.title || ''}
          />
        </>
      ) : (
        <EmptyReadingState hasBooks={allBooks.length > 0} />
      )}
    </div>
  );
};

function EmptyReadingState({ hasBooks }: { hasBooks: boolean }) {
  const { isAddBookDrawerOpen, setAddBookDrawerOpen } = useBookStore();

  return (
    <div className="group rounded-lg border border-mono-subtle/40 bg-white p-8 shadow-sm transition-shadow hover:shadow-md h-[400px] flex flex-col justify-center">
      <div className="text-center space-y-4">
        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
          <Library className="w-6 h-6 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{hasBooks ? 'No Books Currently Being Read' : 'Start Your Reading Journey'}</h3>
          <p className="text-sm text-gray-600 max-w-xs mx-auto">
            {hasBooks
              ? 'Browse your library to continue reading a book or add a new one to your collection.'
              : 'Track your reading progress, collect meaningful highlights, and discover new books to read.'}
          </p>
        </div>
        {hasBooks ? (
          <div className="flex items-center justify-center gap-3">
            <Button asChild variant="outline" className="mt-4">
              <a href="/dashboard/library">Go to Library</a>
            </Button>
            <Drawer open={isAddBookDrawerOpen} onOpenChange={setAddBookDrawerOpen}>
              <DrawerTrigger asChild>
                <Button className="mt-4 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Add New Book
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[90vh] flex flex-col">
                <DrawerHeader className="flex-shrink-0">
                  <DrawerTitle>Add New Book</DrawerTitle>
                  <DrawerDescription>Add another book to your collection.</DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto px-4 pb-8">
                  <AddBookForm onCancel={() => setAddBookDrawerOpen(false)} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Drawer open={isAddBookDrawerOpen} onOpenChange={setAddBookDrawerOpen}>
              <DrawerTrigger asChild>
                <Button className="mt-4 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Add Your First Book
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[90vh] flex flex-col">
                <DrawerHeader className="flex-shrink-0">
                  <DrawerTitle>Add New Book</DrawerTitle>
                  <DrawerDescription>Start your reading journey by adding your first book to your collection.</DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto px-4 pb-8">
                  <AddBookForm onCancel={() => setAddBookDrawerOpen(false)} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        )}
      </div>
    </div>
  );
}

export default CurrentlyReading;
