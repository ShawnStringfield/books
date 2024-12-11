import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Library, PlusCircle, Eye } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/app/components/ui/drawer';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/app/components/ui/sheet';
import { AddBookForm } from './AddBookForm';
import Link from 'next/link';
import { Book, ReadingStatus } from '../types/books';
import { useDashboardStore } from '../stores/useDashboardStore';

interface CurrentlyReadingProps {
  books: Book[];
}

const CurrentlyReading = ({ books }: CurrentlyReadingProps) => {
  const { updateBookStatus } = useDashboardStore();

  console.log(books);

  return (
    <div className="space-y-4 my-16">
      {books.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold flex items-center gap-2">Currently Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {books.map((book) => (
              <Card key={book.id} className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 h-[215px]">
                <CardContent className="p-6 h-full">
                  <div className="flex flex-col h-full">
                    {/* Book Title Header */}
                    <div>
                      <Link key={book.id} href={`/dashboard/books/${book.id}`} className="block group">
                        <h4 className="font-semibold text-md group-hover:text-blue-600 transition-colors">{book.title}</h4>
                      </Link>
                      <p className="text-xs text-gray-600 py-1">@{book.author}</p>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center gap-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <button
                              className=" hover:bg-gray-100 
                                  transition-colors duration-200 text-gray-600 hover:text-gray-800"
                              aria-label={`Quick view ${book.title}`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </SheetTrigger>
                          <SheetContent side="right" className="w-3/4 sm:w-[540px] md:min-w-[500px] lg:min-w-[700px] m-4 h-auto rounded-lg">
                            <SheetHeader>
                              <SheetTitle>{book.title}</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6">
                              <div className="space-y-6">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Author</h3>
                                  <p className="mt-1 text-lg">{book.author}</p>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Progress</h3>
                                  <p className="mt-1 text-lg">
                                    Page {book.currentPage} of {book.totalPages} ({Math.round((book.currentPage / book.totalPages) * 100)}%)
                                  </p>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                  <p className="mt-1 text-lg capitalize">{book.status.replace('_', ' ').toLowerCase()}</p>
                                </div>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>

                        <div className="flex items-center gap-1">
                          {Object.values(ReadingStatus).map((status) => (
                            <button
                              key={status}
                              onClick={() => updateBookStatus(book.id, status)}
                              className={`px-2 py-1 text-[12px] rounded-full transition-colors ${
                                book.status === status
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                              }`}
                              aria-label={`Set status to ${status.replace('_', ' ').toLowerCase()}`}
                            >
                              {status
                                .replace('_', ' ')
                                .split(' ')
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ')}
                            </button>
                          ))}
                        </div>
                      </div>

                      <span className="text-xs text-gray-400">{Math.round((book.currentPage / book.totalPages) * 100)}%</span>
                    </div>
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
