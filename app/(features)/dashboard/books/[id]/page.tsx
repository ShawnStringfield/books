'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDashboardStore } from '../../stores/useDashboardStore';
import { Button } from '@/app/components/ui/button';
import { ReadingStatus } from '../../types/books';
import { Card, CardContent } from '@/app/components/ui/card';
import { useBookStatus } from '@/app/hooks/useBookStatus';
import Image from 'next/image';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { DeleteBookDialog } from '../../components/DeleteBookDialog';
import { selectIsLastBook } from '../../stores/useDashboardStore';
import DashboardLayout from '../../components/DashboardLayout';
import BookHighlights from '../../components/BookHighlights';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';

export default function BookDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { books: rawBooks, updateBookStatus, updateReadingProgress, deleteBook } = useDashboardStore();
  const isLoading = useDashboardStore((state) => state.isLoading);
  const books = rawBooks.map((b) => ({ ...b, status: b.status as ReadingStatus }));
  const { canChangeStatus, changeBookStatus } = useBookStatus(books);
  const book = books.find((b) => b.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isLastBook = useDashboardStore(selectIsLastBook);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ReadingStatus | null>(null);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!book) return <div>Book not found</div>;

  const handleStatusChange = async (newStatus: ReadingStatus) => {
    if (newStatus === ReadingStatus.NOT_STARTED) {
      setPendingStatus(newStatus);
      setShowResetDialog(true);
      return;
    }

    if (await changeBookStatus(book, newStatus)) {
      updateBookStatus(book.id, newStatus);
    }
  };

  const handleResetConfirm = async () => {
    if (pendingStatus && (await changeBookStatus(book, pendingStatus))) {
      updateBookStatus(book.id, pendingStatus);
      updateReadingProgress(book.id, 0); // Reset progress to 0
    }
    setShowResetDialog(false);
    setPendingStatus(null);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = parseInt(e.target.value);
    if (!isNaN(newPage) && newPage >= 0 && newPage <= book.totalPages) {
      updateReadingProgress(book.id, newPage);
    }
  };

  const handleDeleteBook = () => {
    if (!isLastBook) {
      deleteBook(book.id);
      router.push('/dashboard/books');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-full mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isLastBook}
            title={isLastBook ? 'Cannot delete the last book' : undefined}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Book
            {isLastBook && <span className="ml-2 text-sm">(Cannot delete last book)</span>}
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex gap-6">
              {book.coverUrl && (
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  width={200}
                  height={300}
                  className="object-cover rounded-lg w-auto h-[225px] sm:h-[262px] md:h-[300px]"
                  priority
                />
              )}
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">{book.title}</h1>
                <p className="text-gray-600">{book.author}</p>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Reading Progress</label>
                  <input
                    type="number"
                    value={book.currentPage}
                    onChange={handleProgressChange}
                    className="w-24 px-3 py-2 border rounded-md"
                    min={0}
                    max={book.totalPages}
                  />
                  <p className="text-sm text-gray-600">
                    of {book.totalPages} pages ({Math.round((book.currentPage / book.totalPages) * 100)}%)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Status</label>
                  <div className="flex gap-2">
                    {Object.values(ReadingStatus).map((status) => (
                      <Button
                        key={status}
                        disabled={!canChangeStatus(book, status)}
                        variant={book.status === status ? 'default' : 'outline'}
                        onClick={() => handleStatusChange(status)}
                        size="sm"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <BookHighlights bookId={book.id} currentPage={book.currentPage || 0} />
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Reading Progress?</AlertDialogTitle>
              <AlertDialogDescription>
                Changing the status to &ldquo;Not Started&rdquo; will reset your reading progress to 0 pages. Are you sure you want to continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPendingStatus(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DeleteBookDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleDeleteBook} bookTitle={book.title} />
      </div>
    </DashboardLayout>
  );
}
