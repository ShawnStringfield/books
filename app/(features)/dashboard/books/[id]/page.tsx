'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDashboardStore } from '../../stores/useDashboardStore';
import { Button } from '@/app/components/ui/button';
import { ReadingStatus } from '../../types/books';
import { useBookStatus } from '@/app/hooks/useBookStatus';
import { useState, useEffect } from 'react';
import { Trash2, Library, ChevronRight, BookOpen } from 'lucide-react';
import { DeleteBookDialog } from '../../components/DeleteBookDialog';
import { selectIsLastBook } from '../../stores/useDashboardStore';
import DashboardLayout from '../../components/DashboardLayout';
import BookHighlights from '../../components/BookHighlights';
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
import ReadingControls from '../../components/ReadingControls';
import EditableGenre from '../../components/EditableGenre';
import { EditModeProvider, useEditMode } from '../../contexts/EditModeContext';

function BookDetailsContent() {
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
  const { showEditControls, toggleEditControls } = useEditMode();

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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            {/* Left side - Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm -ml-1 pl-[2px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard/books')}
                className="text-gray-500 hover:text-gray-700 -ml-[9px] flex items-center gap-1.5"
              >
                <Library className="h-4 w-4" />
                Library
              </Button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center gap-1.5 text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span className="truncate max-w-[200px]">{book.title}</span>
              </div>
            </div>

            {/* Right side - Controls */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={toggleEditControls} className="text-gray-500 hover:text-gray-700">
                {showEditControls ? 'Hide Edit' : 'Edit'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:hover:text-gray-500"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLastBook}
                title={isLastBook ? 'Cannot delete the last book' : undefined}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <h2 className="text-xl font-semibold -mt-2">{book.subtitle}</h2>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                By: {book.author} • {book.totalPages} pages
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <EditableGenre genre={book.genre || ''} bookId={book.id} />
                {book.isbn && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span>ISBN: {book.isbn}</span>
                  </>
                )}
                {!book.genre && !book.isbn && <span className="text-gray-400 italic">No additional details available</span>}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-4">
          <EditableBookDescription description={book.description || ''} bookId={book.id} />
        </div>

        {/* Reading Controls */}
        <ReadingControls
          bookId={book.id}
          currentPage={book.currentPage || 0}
          totalPages={book.totalPages}
          status={book.status}
          uniqueId={book.id}
          variant="desktop"
          onStatusChange={handleStatusChange}
          onProgressChange={handleProgressChange}
        />

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

export default function BookDetailsPage() {
  return (
    <EditModeProvider>
      <BookDetailsContent />
    </EditModeProvider>
  );
}
