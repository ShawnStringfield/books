import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Library, PlusCircle } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/app/components/ui/drawer';
import { AddBookForm } from './AddBookForm';
import Link from 'next/link';
import { Book } from '../types/books';
import { useDashboardStore } from '../stores/useDashboardStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';

interface CurrentlyReadingProps {
  books: Book[];
}

const CurrentlyReading = ({ books }: CurrentlyReadingProps) => {
  return (
    <div className="space-y-4 my-16">
      {books.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-[-12px]">Currently Reading</h2>
          <div className="divide-y">
            {books.map((book) => (
              <Link key={book.id} href={`/dashboard/books/${book.id}`} className="flex items-center gap-4 py-4 hover:bg-gray-50/50 transition-colors">
                <Avatar className="h-12 w-12 rounded-full shrink-0">
                  <AvatarImage src={book.coverUrl} alt={book.title} className="object-cover" />
                  <AvatarFallback className="text-sm bg-blue-50 text-blue-600">
                    {book.title
                      .split(' ')
                      .map((word) => word[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{book.author}</p>
                </div>
                <div className="text-sm text-gray-500">
                  Page {book.currentPage} of {book.totalPages}
                </div>
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
