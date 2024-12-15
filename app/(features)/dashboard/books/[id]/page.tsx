'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDashboardStore } from '../../stores/useDashboardStore';
import { Button } from '@/app/components/ui/button';
import { ReadingStatus } from '../../types/books';
import { useBookStatus } from '@/app/hooks/useBookStatus';
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { DeleteBookDialog } from '../../components/DeleteBookDialog';
import { selectIsLastBook } from '../../stores/useDashboardStore';
import DashboardLayout from '../../components/DashboardLayout';
import BookHighlights from '../../components/BookHighlights';
import { format } from 'date-fns';
import { DashboardStats } from '../../components/stats/DashboardStats';
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
import ReadingProgressBar from '../../components/ReadingProgressBar';
import EditableBookDescription from '../../components/EditableBookDescription';
import StatusButtons from '../../components/StatusOptions';
import BookProgressSlider from '../../components/BookProgressSlider';

export default function BookDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const { books: rawBooks = [], updateBookStatus, updateReadingProgress, deleteBook } = useDashboardStore();
  const isLoading = useDashboardStore((state) => state.isLoading);
  const books = rawBooks.map((b) => ({ ...b, status: b.status as ReadingStatus }));
  const { changeBookStatus, isChangingStatus } = useBookStatus(books);
  const book = books.find((b) => b.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isLastBook = useDashboardStore(selectIsLastBook);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ReadingStatus | null>(null);

  // Redirect if no id is provided
  useEffect(() => {
    if (!id) {
      router.push('/dashboard/books');
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!book) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <h1 className="text-2xl font-bold">Book not found</h1>
          <Button variant="outline" onClick={() => router.push('/dashboard/books')}>
            Return to Library
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleStatusChange = async (bookId: string, newStatus: ReadingStatus) => {
    if (isChangingStatus) return;

    if (newStatus === ReadingStatus.NOT_STARTED) {
      setPendingStatus(newStatus);
      setShowResetDialog(true);
      return;
    }

    if (await changeBookStatus(book, newStatus)) {
      updateBookStatus(bookId, newStatus);
    }
  };

  const handleResetConfirm = async () => {
    if (!pendingStatus || isChangingStatus) return;

    if (await changeBookStatus(book, pendingStatus)) {
      updateBookStatus(book.id, pendingStatus);
      updateReadingProgress(book.id, 0); // Reset progress to 0
    }
    setShowResetDialog(false);
    setPendingStatus(null);
  };

  const handleDeleteBook = () => {
    if (!isLastBook) {
      deleteBook(book.id);
      router.push('/dashboard/books');
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newPage = value[0];
    updateReadingProgress(book.id, newPage);

    // Automatically update status based on pages read
    if (newPage === 0) {
      updateBookStatus(book.id, ReadingStatus.NOT_STARTED);
    } else if (newPage === book.totalPages) {
      updateBookStatus(book.id, ReadingStatus.COMPLETED);
    } else if (newPage > 0) {
      updateBookStatus(book.id, ReadingStatus.IN_PROGRESS);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 pb-24 max-w-3xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isLastBook}
              title={isLastBook ? 'Cannot delete the last book' : undefined}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>

          <h1 className="text-3xl font-bold">{book.title}</h1>
          <h2 className="text-xl font-semibold">{book.subtitle}</h2>

          {/* About Section */}
          <div className="space-y-4">
            <EditableBookDescription description={book.description || ''} bookId={book.id} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Genre</h3>
                <p className="text-gray-600">{book.genre || 'Unknown'}</p>
              </div>
              <div>
                <h3 className="font-medium">ISBN</h3>
                <p className="text-gray-600">{book.isbn || 'Unknown'}</p>
              </div>
              <div>
                <h3 className="font-medium">Publisher</h3>
                <p className="text-gray-600">{book.publisher || 'Unknown'}</p>
              </div>
              <div>
                <h3 className="font-medium">Language</h3>
                <p className="text-gray-600">{book.language || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex flex-col items-start space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{book.author}</h2>
            <p className="text-sm text-gray-600">Published: {book.publishDate ? format(new Date(book.publishDate), 'MMMM yyyy') : 'Unknown'}</p>
          </div>
        </div>

        {/* Reading Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Reading Status</label>
          <StatusButtons
            bookId={book.id}
            currentStatus={book.status}
            onStatusChange={handleStatusChange}
            variant="full-width"
            roundedVariant="compact"
          />
        </div>

        {/* Reading Progress */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">Reading Progress</label>
          <BookProgressSlider
            currentPage={book.currentPage || 0}
            totalPages={book.totalPages}
            onPageChange={handleProgressChange}
            uniqueId={book.id}
            variant="desktop"
            showSlider={true}
          />
        </div>

        {/* Book Highlights */}
        <div className="space-y-4">
          <BookHighlights bookId={book.id} currentPage={book.currentPage || 0} />
        </div>

        {/* Keep existing dialogs */}
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
        <DashboardStats />
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Progress</span>
            <span>
              {book.currentPage || 0} of {book.totalPages || 0} pages
            </span>
          </div>
          <ReadingProgressBar
            currentPage={book.currentPage || 0}
            totalPages={book.totalPages || 0}
            progress={book.totalPages ? Math.round(((book.currentPage || 0) / book.totalPages) * 100) : 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
