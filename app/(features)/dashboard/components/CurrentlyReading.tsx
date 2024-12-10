import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Clock, Library, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/app/components/ui/drawer';
import { AddBookForm } from './AddBookForm';
import Link from 'next/link';
import { Book } from '../types/books';
import { useDashboardStore } from '../stores/useDashboardStore';

interface CurrentlyReadingProps {
  books: Book[];
}

const CurrentlyReading = ({ books }: CurrentlyReadingProps) => {
  return (
    <div className="space-y-4">
      {books.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Currently Reading
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map((book) => (
              <Link key={book.id} href={`/dashboard/books/${book.id}`} className="block">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {book.coverUrl && <Image src={book.coverUrl} alt={book.title} width={96} height={144} className="object-cover rounded" />}
                      <div className="flex-1">
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.author}</p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(book.currentPage / book.totalPages) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-sm mt-1">
                          Page {book.currentPage} of {book.totalPages}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
