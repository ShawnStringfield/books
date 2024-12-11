import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Library, PlusCircle, Plus } from 'lucide-react';
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
    <div className="space-y-4 my-16">
      {books.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold flex items-center gap-2">Currently Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {books.map((book) => (
              <Link key={book.id} href={`/dashboard/books/${book.id}`} className="block group">
                <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 h-[215px]">
                  <CardContent className="p-6 h-full">
                    <div className="flex flex-col h-full">
                      {/* Book Title Header */}
                      <div>
                        <h4 className="font-semibold text-md group-hover:text-blue-600 transition-colors">{book.title}</h4>
                        <p className="text-xs text-gray-600 py-1">@{book.author}</p>
                      </div>

                      {/* Bottom Actions */}
                      <div className="flex justify-between items-center mt-auto">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                          className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 
                            transition-colors duration-200 text-gray-600 hover:text-gray-800"
                          aria-label={`Add highlight to ${book.title}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        <span className="text-sm text-gray-600">{Math.round((book.currentPage / book.totalPages) * 100)}%</span>
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
