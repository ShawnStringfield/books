import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Library, PlusCircle } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/app/components/ui/drawer';
import { AddBookForm } from './AddBookForm';
import Link from 'next/link';
import { Book } from '../types/books';
import { useDashboardStore } from '../stores/useDashboardStore';
import StatusButtons from './StatusOptions';
import BookDetailsSheet from './BookDetailsSheet';

interface CurrentlyReadingProps {
  books: Book[];
}

const CurrentlyReading = ({ books }: CurrentlyReadingProps) => {
  const { updateBookStatus } = useDashboardStore();

  return (
    <div className="space-y-4 my-16">
      {books.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold flex items-center gap-2">Currently Reading</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {books.map((book) => (
              <Card key={book.id} className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 h-[215px]">
                <CardContent className="p-6 flex flex-col h-full">
                  <div>
                    <Link href={`/dashboard/books/${book.id}`} className="block group" aria-label={`View details for ${book.title}`}>
                      <h4 className="font-semibold text-md group-hover:text-blue-600 transition-colors leading-tight">{book.title}</h4>
                    </Link>
                    <p className="text-xs text-gray-600 py-1">by {book.author}</p>
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-2">
                      <BookDetailsSheet book={book} />
                      <StatusButtons bookId={book.id} currentStatus={book.status} onStatusChange={updateBookStatus} />
                    </div>

                    <span className="text-xs text-gray-400">{Math.round((book.currentPage / book.totalPages) * 100)}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <EmptyReadingState />
      )}
    </div>
  );
};

function EmptyReadingState() {
  const { isAddBookDrawerOpen, setAddBookDrawerOpen } = useDashboardStore();

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
              </DrawerHeader>
              <div className="p-4">
                <AddBookForm />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </CardContent>
    </Card>
  );
}

export default CurrentlyReading;
