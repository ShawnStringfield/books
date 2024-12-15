'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDashboardStore } from '../../stores/useDashboardStore';
import { Button } from '@/app/components/ui/button';
import { Book, ReadingStatus } from '../../types/books';
import { useBookStatus } from '@/app/hooks/useBookStatus';
import { useState, useEffect, useMemo } from 'react';
import { Trash2, Clock, BookOpen, Calendar, BarChart3 } from 'lucide-react';
import { DeleteBookDialog } from '../../components/DeleteBookDialog';
import { selectIsLastBook } from '../../stores/useDashboardStore';
import DashboardLayout from '../../components/DashboardLayout';
import BookHighlights from '../../components/BookHighlights';
import { format } from 'date-fns';
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

interface ReadingStats {
  averagePagesPerDay: number;
  daysReading: number;
  estimatedTimeLeft: number;
  completionPercentage: number;
}

function calculateReadingStats(book: Book, startDate: Date): ReadingStats {
  const currentDate = new Date();
  const daysReading = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const averagePagesPerDay = daysReading > 0 ? book.currentPage / daysReading : 0;
  const pagesLeft = book.totalPages - book.currentPage;
  const estimatedTimeLeft = averagePagesPerDay > 0 ? Math.ceil(pagesLeft / averagePagesPerDay) : 0;
  const completionPercentage = (book.currentPage / book.totalPages) * 100;

  return {
    averagePagesPerDay: Math.round(averagePagesPerDay),
    daysReading,
    estimatedTimeLeft,
    completionPercentage: Math.round(completionPercentage),
  };
}

export default function BookDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const { books: rawBooks = [], updateBookStatus, updateReadingProgress, deleteBook } = useDashboardStore();
  const isLoading = useDashboardStore((state) => state.isLoading);
  const books = rawBooks.map((b) => ({ ...b, status: b.status as ReadingStatus }));
  const { canChangeStatus, changeBookStatus, isChangingStatus } = useBookStatus(books);
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

  // Calculate reading stats
  const readingStats = useMemo(() => {
    if (!book) return null;
    return calculateReadingStats(book, book.startDate ? new Date(book.startDate) : new Date());
  }, [book]);

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

  const handleStatusChange = async (newStatus: ReadingStatus) => {
    if (isChangingStatus) return;

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
          <div className="flex flex-wrap gap-2">
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

        {/* Reading Progress */}
        <div className="space-y-4">
          <ReadingProgressBar currentPage={book.currentPage} totalPages={book.totalPages} progress={readingStats?.completionPercentage || 0} />
        </div>

        {/* Reading Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={<Clock />} title="Reading Time" value={`${readingStats?.daysReading} days`} />
          <StatCard icon={<BookOpen />} title="Pages per Day" value={`${readingStats?.averagePagesPerDay}`} />
          <StatCard icon={<Calendar />} title="Est. Completion" value={`${readingStats?.estimatedTimeLeft} days`} />
          <StatCard icon={<BarChart3 />} title="Completion" value={`${readingStats?.completionPercentage}%`} />
        </div>

        {/* Book Highlights */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Highlights</h2>
          <BookHighlights bookId={book.id} currentPage={book.currentPage || 0} />
        </div>

        {/* About Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">About the Book</h2>
          <p className="text-gray-700">{book.description || 'No description available'}</p>
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
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Progress</span>
            <span>
              {book.currentPage} of {book.totalPages} pages
            </span>
          </div>
          <ReadingProgressBar currentPage={book.currentPage} totalPages={book.totalPages} progress={readingStats?.completionPercentage || 0} />
        </div>
      </div>
    </DashboardLayout>
  );
}

// Update StatCard to remove border
function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="p-4 rounded-lg bg-gray-50">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-600">{icon}</span>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
