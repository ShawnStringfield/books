import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Library, PlusCircle, BookOpen } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from '@/app/components/ui/drawer';
import { AddBookForm } from './AddBookForm';
import { Book } from '@/app/stores/useBookStore';
import { useBookStore, selectIsLastBook } from '@/app/stores/useBookStore';
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
  const isLastBook = useBookStore(selectIsLastBook);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (bookToDelete && !isLastBook) {
      deleteBook(bookToDelete);
      setBookToDelete(null);
    }
  };

  return (
    <div className="space-y-4 my-16">
      {books.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Currently Reading
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onStatusChange={updateBookStatus}
                onDelete={(id) => setBookToDelete(id)}
                isLastBook={isLastBook}
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
        <EmptyReadingState />
      )}
    </div>
  );
};

function EmptyReadingState() {
  const { isAddBookDrawerOpen, setAddBookDrawerOpen } = useBookStore();

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-white">
      <CardContent className="pt-6">
        <div className="text-center space-y-4 py-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Library className="w-8 h-8 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Start Your Reading Journey</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Track your reading progress, collect meaningful highlights, and discover new books to read.
            </p>
          </div>
          <Drawer open={isAddBookDrawerOpen} onOpenChange={setAddBookDrawerOpen}>
            <DrawerTrigger asChild>
              <Button className="mt-4 flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Your First Book
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Add New Book</DrawerTitle>
                <DrawerDescription>Start your reading journey by adding your first book to your collection.</DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <AddBookForm onCancel={() => setAddBookDrawerOpen(false)} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </CardContent>
    </Card>
  );
}

export default CurrentlyReading;
