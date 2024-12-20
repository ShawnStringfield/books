'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDashboardStore } from '../../stores/useDashboardStore';
import { Button } from '@/app/components/ui/button';
import { ReadingStatus } from '../../types/books';
import { useBookStatus } from '@/app/hooks/useBookStatus';
import { useState, useEffect } from 'react';
import { Plus, Settings2 } from 'lucide-react';
import { selectIsLastBook } from '../../stores/useDashboardStore';
import DashboardLayout from '../../components/DashboardLayout';
import BookHighlights from '../../components/BookHighlights';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import ReadingProgressBar from '../../components/ReadingProgressBar';
import EditableBookDescription from '../../components/EditableBookDescription';
import ReadingControls from '../../components/ReadingControls';
import EditableGenre from '../../components/EditableGenre';
import { EditModeProvider, useEditMode } from '../../contexts/EditModeContext';

function BookDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const { books: rawBooks = [], updateBookStatus, updateReadingProgress, updateBookDescription, updateBookGenre } = useDashboardStore();
  const isLoading = useDashboardStore((state) => state.isLoading);
  const books = rawBooks.map((b) => ({ ...b, status: b.status as ReadingStatus }));
  const { changeBookStatus, isChangingStatus } = useBookStatus(books);
  const book = books.find((b) => b.id === id);
  const isLastBook = useDashboardStore(selectIsLastBook);
  const { showEditControls, toggleEditControls } = useEditMode();
  const [editedDescription, setEditedDescription] = useState('');
  const [editedGenre, setEditedGenre] = useState('');
  const [showReadingControlsDialog, setShowReadingControlsDialog] = useState(false);
  const [showHighlightsDialog, setShowHighlightsDialog] = useState(false);

  // Redirect if no id is provided
  useEffect(() => {
    if (!id) {
      router.push('/dashboard/library');
    }
  }, [id, router]);

  // Show loading state if either isLoading is true or books haven't been loaded yet
  if (isLoading || rawBooks.length === 0) {
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
          <Button variant="outline" onClick={() => router.push('/dashboard/library')}>
            Return to Library
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleStatusChange = async (bookId: string, newStatus: ReadingStatus) => {
    if (isChangingStatus) return;

    if (await changeBookStatus(book, newStatus)) {
      updateBookStatus(bookId, newStatus);
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

  const handleSaveChanges = () => {
    if (editedDescription) {
      updateBookDescription(book.id, editedDescription);
    }
    if (editedGenre) {
      updateBookGenre(book.id, editedGenre);
    }
    toggleEditControls(); // Exit edit mode after saving
  };

  return (
    <DashboardLayout>
      {/* Highlights Dialog */}
      <Dialog open={showHighlightsDialog} onOpenChange={setShowHighlightsDialog}>
        <DialogContent className="sm:max-w-[425px] top-0 translate-y-0">
          <DialogHeader>
            <DialogTitle>Add Highlight</DialogTitle>
          </DialogHeader>
          <BookHighlights bookId={book.id} currentPage={book.currentPage || 0} showForm={true} formOnly={true} />
        </DialogContent>
      </Dialog>

      <div className="p-6 pb-24 max-w-4xl mx-auto space-y-8">
        {/* Mobile Controls */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => setShowReadingControlsDialog(true)} className="h-10 w-10 rounded-full bg-slate-200">
            <Settings2 className="h-10 w-10 " />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowHighlightsDialog(true)} className="h-10 w-10 rounded-full bg-slate-200">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Reading Controls Dialog */}
        <Dialog open={showReadingControlsDialog} onOpenChange={setShowReadingControlsDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Reading Controls</DialogTitle>
            </DialogHeader>
            <ReadingControls
              bookId={book.id}
              currentPage={book.currentPage || 0}
              totalPages={book.totalPages}
              status={book.status}
              uniqueId={book.id}
              variant="mobile"
              onStatusChange={handleStatusChange}
              onProgressChange={handleProgressChange}
              onEdit={toggleEditControls}
              isLastBook={isLastBook}
              showEditControls={showEditControls}
              onSaveChanges={handleSaveChanges}
            />
          </DialogContent>
        </Dialog>

        <div className="space-y-6">
          {/* Book Details */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold leading-0 text-slate-600">{book.title}</h1>
              <h2 className="text-lg font-semibold leading-tight text-slate-500">{book.subtitle}</h2>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  By: {book.author} • {book.totalPages} pages
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <EditableGenre genre={book.genre || ''} bookId={book.id} isEditing={showEditControls} onChange={setEditedGenre} />
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
        </div>

        {/* About Section */}
        <div className="space-y-4 py-8">
          <h2 className="text-lg font-semibold leading-tight text-slate-500">About This Book</h2>
          <EditableBookDescription
            description={book.description || ''}
            bookId={book.id}
            isEditing={showEditControls}
            onChange={setEditedDescription}
          />
        </div>

        {/* Book Highlights Section */}
        <div className="space-y-4 py-8">
          <h2 className="text-lg font-semibold leading-tight text-slate-500">Highlights</h2>
          <BookHighlights bookId={book.id} currentPage={book.currentPage || 0} showForm={false} listOnly={true} />
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <div className="max-w-4xl mx-auto space-y-2">
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
