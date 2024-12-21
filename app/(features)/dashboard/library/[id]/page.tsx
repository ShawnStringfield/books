'use client';

import { useParams, useRouter } from 'next/navigation';
import { useBookStore, selectHasHydrated } from '../../stores/useBookStore';
import { Button } from '@/app/components/ui/button';
import { ReadingStatus } from '../../types/books';
import { useBookStatus } from '@/app/hooks/useBookStatus';
import { useState, useEffect } from 'react';
import { Plus, Settings2, Pencil, ExternalLink, Info } from 'lucide-react';
import { selectIsLastBook } from '../../stores/useBookStore';
import DashboardLayout from '../../components/DashboardLayout';
import BookHighlights from '../../components/BookHighlights';
import ReadingProgressBar from '../../components/ReadingProgressBar';
import EditableBookDescription from '../../components/EditableBookDescription';
import EditableGenre from '../../components/EditableGenre';
import { EditModeProvider, useEditMode } from '../../contexts/EditModeContext';
import Toolbar from '../../components/Toolbar';
import { calculatePercentComplete } from '../../utils/statsCalculator';
import ReadingControlsDialog from '../../components/dialogs/ReadingControlsDialog';
import BookHighlightsDialog from '../../components/dialogs/BookHighlightsDialog';

function BookDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const { books: rawBooks = [], updateBookStatus, updateReadingProgress, updateBookDescription, updateBookGenre, deleteBook } = useBookStore();
  const isLoading = useBookStore((state) => state.isLoading);
  const hasHydrated = useBookStore(selectHasHydrated);
  const books = rawBooks.map((b) => ({ ...b, status: b.status as ReadingStatus }));
  const { changeBookStatus, isChangingStatus } = useBookStatus(books);
  const book = books.find((b) => b.id === id);
  const isLastBook = useBookStore(selectIsLastBook);
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
  if (!hasHydrated || isLoading || rawBooks.length === 0) {
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

  const handleDelete = () => {
    if (!isLastBook) {
      deleteBook(book.id);
      router.push('/dashboard/library');
    }
  };

  return (
    <DashboardLayout>
      {/* Progress Bar - Moved from footer to top */}
      <div className="relative -mt-[1px] bg-white overflow-visible">
        <ReadingProgressBar
          currentPage={book.currentPage || 0}
          totalPages={book.totalPages || 0}
          progress={calculatePercentComplete(book.currentPage, book.totalPages)}
          variant="bleed"
        />
      </div>

      {/* Reading Controls Dialog */}
      <ReadingControlsDialog
        open={showReadingControlsDialog}
        onOpenChange={setShowReadingControlsDialog}
        bookId={book.id}
        currentPage={book.currentPage || 0}
        totalPages={book.totalPages}
        status={book.status}
        onStatusChange={handleStatusChange}
        onProgressChange={handleProgressChange}
        onDelete={handleDelete}
        isLastBook={isLastBook}
      />

      {/* Highlights Dialog */}
      <BookHighlightsDialog open={showHighlightsDialog} onOpenChange={setShowHighlightsDialog} bookId={book.id} currentPage={book.currentPage || 0} />

      <div className="p-6 pb-12 max-w-4xl mx-auto space-y-8">
        {/* Mobile Controls */}
        <Toolbar
          actions={[
            {
              icon: Settings2,
              label: 'Reading controls',
              onClick: () => setShowReadingControlsDialog(true),
            },
            {
              icon: Plus,
              label: 'Add highlight',
              onClick: () => setShowHighlightsDialog(true),
            },
            {
              icon: Pencil,
              label: 'Toggle edit mode',
              onClick: toggleEditControls,
            },
          ]}
          className="flex items-center gap-3 mb-4"
        />

        {/* Book Details */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold leading-0 text-slate-600">{book.title}</h1>
                <h2 className="text-lg font-semibold leading-tight text-slate-500">{book.subtitle}</h2>
              </div>
              <div className="flex items-center gap-2">
                {showEditControls ? (
                  <>
                    <Button variant="outline" size="sm" onClick={toggleEditControls} className="text-xs py-1 px-2">
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveChanges} className="text-xs py-1 px-2">
                      Save Changes
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
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
              <div className="flex items-center gap-4 mt-3">
                {book.previewLink && (
                  <a
                    href={book.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="Preview book"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Preview
                  </a>
                )}
                {book.infoLink && (
                  <a
                    href={book.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="More information about book"
                  >
                    <Info className="h-4 w-4" />
                    More Information
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-4 pt-8">
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
          <BookHighlights bookId={book.id} currentPage={book.currentPage || 0} showForm={false} onClose={() => setShowHighlightsDialog(false)} />
        </div>

        {/* Book Progress Section */}
        <div className="space-y-4 py-8 border-t">
          <h2 className="text-lg font-semibold leading-tight text-slate-500">Reading Progress</h2>
          <ReadingProgressBar
            currentPage={book.currentPage || 0}
            totalPages={book.totalPages}
            progress={calculatePercentComplete(book.currentPage, book.totalPages)}
            variant="default"
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
