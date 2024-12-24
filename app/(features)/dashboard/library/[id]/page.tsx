'use client';

import { useParams, useRouter } from 'next/navigation';
import { useBookStore, selectHasHydrated, selectIsLastBook } from '@/app/stores/useBookStore';
import { Button } from '@/app/components/ui/button';
import { ReadingStatus } from '@/app/stores/types';
import { useBookStatus } from '@/app/hooks/useBookStatus';
import { useState, useEffect } from 'react';
import { Plus, Settings2, Pencil, ExternalLink, Info, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import BookHighlights from '@/app/components/highlights/BookHighlights';
import ReadingProgressBar from '@/app/components/book/ReadingProgressBar';
import EditableBookDescription from '@/app/components/book/EditableBookDescription';
import EditableGenre from '@/app/components/book/EditableGenre';
import { EditModeProvider, useEditMode } from '@/app/contexts/EditModeContext';
import Toolbar, { ToolbarAction } from '@/app/components/dashboard/Toolbar';
import { calculatePercentComplete } from '@/app/utils/bookUtils';
import { ReadingDates } from '@/app/components/book/book-metadata';

function BookDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const { books: rawBooks = [], updateBookStatus, updateReadingProgress, updateBookDescription, updateBookGenre, deleteBook } = useBookStore();
  const isLoading = useBookStore((state) => state.isLoading);
  const hasHydrated = useBookStore(selectHasHydrated);
  const books = rawBooks.map((b) => ({ ...b, status: b.status as (typeof ReadingStatus)[keyof typeof ReadingStatus] }));
  const { changeBookStatus, isChangingStatus } = useBookStatus(books);
  const book = books.find((b) => b.id === id);
  const isLastBook = useBookStore(selectIsLastBook);
  const { showEditControls, toggleEditControls } = useEditMode();
  const [editedDescription, setEditedDescription] = useState('');
  const [editedGenre, setEditedGenre] = useState('');
  const [showReadingControls, setShowReadingControls] = useState(false);
  const [showHighlightForm, setShowHighlightForm] = useState(false);
  const [manualTotalPages, setManualTotalPages] = useState<string>('');

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

  const toolbarActions: ToolbarAction[] = [
    {
      icon: Settings2,
      label: 'Reading controls',
      onClick: () => setShowReadingControls(!showReadingControls),
    },
    {
      icon: Plus,
      label: 'Add highlight',
      onClick: () => setShowHighlightForm(!showHighlightForm),
    },
    {
      icon: Pencil,
      label: 'Toggle edit mode',
      onClick: toggleEditControls,
    },
  ];

  const handleStatusChange = async (bookId: string, newStatus: (typeof ReadingStatus)[keyof typeof ReadingStatus]) => {
    if (isChangingStatus) return;

    if (await changeBookStatus(book, newStatus)) {
      updateBookStatus(bookId, newStatus);
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newPage = value[0];
    updateReadingProgress(book.id, newPage);
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

  const handleTotalPagesUpdate = (value: number) => {
    if (value > 0) {
      // First update the reading progress to ensure current page is valid
      const newCurrentPage = Math.min(book.currentPage || 0, value);
      updateReadingProgress(book.id, newCurrentPage);

      // Create a new book with updated values
      const updatedBook = {
        ...book,
        totalPages: value,
        currentPage: newCurrentPage,
      };

      // Update the book in the store
      useBookStore.setState((state) => ({
        books: state.books.map((b) => (b.id === book.id ? updatedBook : b)),
      }));

      setManualTotalPages('');
      setShowReadingControls(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Progress Bar - Moved from footer to top */}
      <ReadingProgressBar
        currentPage={book.currentPage || 0}
        totalPages={book.totalPages || 0}
        progress={calculatePercentComplete(book.currentPage, book.totalPages)}
        variant="bleed"
        className="relative -mt-[1px] bg-white overflow-visible"
      />

      <div className="p-6 pb-12 max-w-4xl mx-auto space-y-8">
        {/* Mobile Controls */}
        <Toolbar actions={toolbarActions} className="flex items-center gap-3 mb-4" />

        {/* Add Highlight Form */}
        {showHighlightForm && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <BookHighlights bookId={book.id} currentPage={book.currentPage || 0} showForm={true} onClose={() => setShowHighlightForm(false)} />
          </div>
        )}

        {/* Reading Controls Section */}
        {showReadingControls && (
          <div className="bg-gray-50 rounded-lg p-6 space-y-6 border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Reading Controls</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowReadingControls(false)}>
                Close
              </Button>
            </div>

            <div className="space-y-4">
              {/* Reading Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Reading Status</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(ReadingStatus).map((status) => (
                    <Button
                      key={status}
                      variant={book.status === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(book.id, status)}
                      disabled={isChangingStatus}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Reading Progress */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Reading Progress</label>
                <div className="space-y-4">
                  {/* Total Pages Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {manualTotalPages !== '' ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            className="w-16 h-8 text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={manualTotalPages}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setManualTotalPages(value);
                            }}
                            onBlur={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (!isNaN(value) && value > 0) {
                                handleTotalPagesUpdate(value);
                              } else {
                                setManualTotalPages('');
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                              } else if (e.key === 'Escape') {
                                setManualTotalPages('');
                              }
                            }}
                            autoFocus
                          />
                          <span className="text-sm text-gray-500">total pages</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{book.totalPages || 0} total pages</span>
                          <button
                            onClick={() => setManualTotalPages(book.totalPages?.toString() || '')}
                            className="inline-flex items-center text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          {book.totalPages === 0 && (
                            <span className="text-yellow-600 text-sm flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              Set page count to track progress
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Current Page Input */}
                  {book.totalPages > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center">
                        <button
                          type="button"
                          className="h-10 px-2 border border-r-0 rounded-l-lg hover:bg-gray-50"
                          onClick={() => {
                            const newPage = Math.max((book.currentPage || 0) - 1, 0);
                            handleProgressChange([newPage]);
                          }}
                        >
                          <span>-</span>
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={book.currentPage || 0}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            if (value === '') {
                              handleProgressChange([0]);
                              return;
                            }
                            const pageNum = parseInt(value, 10);
                            if (!isNaN(pageNum)) {
                              handleProgressChange([pageNum]);
                            }
                          }}
                          onBlur={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (!isNaN(value)) {
                              const clampedValue = Math.min(Math.max(0, value), book.totalPages);
                              handleProgressChange([clampedValue]);
                            }
                          }}
                          onFocus={(e) => {
                            e.target.select();
                            setTimeout(() => e.target.select(), 0);
                          }}
                          className="w-16 h-10 text-center border-y focus:outline-none focus:ring-0 focus:border-gray-300"
                          style={{
                            WebkitAppearance: 'none',
                            MozAppearance: 'textfield',
                            fontSize: '16px',
                          }}
                        />
                        <button
                          type="button"
                          className="h-10 px-2 border border-l-0 rounded-r-lg hover:bg-gray-50"
                          onClick={() => {
                            const newPage = Math.min((book.currentPage || 0) + 1, book.totalPages);
                            handleProgressChange([newPage]);
                          }}
                        >
                          <span>+</span>
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">current page</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delete Book */}
              <div className="pt-4 border-t">
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLastBook}>
                  Delete Book
                </Button>
                {isLastBook && <p className="text-sm text-red-600 mt-2">Cannot delete the last book in your library</p>}
              </div>
            </div>
          </div>
        )}

        {/* Book Details */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold leading-0 ">{book.title}</h1>
              <h2 className="text-mono text-lg font-semibold leading-tight">{book.subtitle}</h2>
            </div>
            <div className="flex items-center gap-2">
              {showEditControls ? (
                <>
                  <Button variant="outline" size="sm" onClick={toggleEditControls} className="text-xs py-1 px-2">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveChanges} className="text-xs py-1 px-2 bg-brand">
                    Save Changes
                  </Button>
                </>
              ) : null}
            </div>
          </div>
          <div className="mt-2">
            <div className="my-4">
              <p className="text-sm text-mono">
                By: {book.author} • {book.totalPages || 0} pages
              </p>
              <div className="flex flex-col gap-1.5 mt-1">
                <EditableGenre genre={book.genre || ''} bookId={book.id} isEditing={showEditControls} onChange={setEditedGenre} />
                <ReadingDates book={book} />
                {!book.genre && !book.isbn && <span className="italic text-sm text-mono">No additional details available</span>}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3">
              {book.previewLink && (
                <a
                  href={book.previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-brand hover:text-blue-800 transition-colors"
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
                  className="flex items-center gap-1 text-sm text-brand hover:text-blue-800 transition-colors"
                  aria-label="More information about book"
                >
                  <Info className="h-4 w-4" />
                  More Information
                </a>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-4 pt-8">
          <h2 className="text-lg font-semibold leading-tight">About This Book</h2>
          <EditableBookDescription
            description={book.description || ''}
            bookId={book.id}
            isEditing={showEditControls}
            onChange={setEditedDescription}
          />
        </div>

        {/* Book Highlights Section */}
        <div className="space-y-4 py-8">
          <h2 className="text-lg font-semibold leading-tight">Book Highlights</h2>
          <BookHighlights
            bookId={book.id}
            currentPage={book.currentPage || 0}
            showForm={false}
            onClose={() => setShowHighlightForm(false)}
            className="space-y-4"
          />
        </div>

        {/* Book Progress Section */}
        <div className="space-y-4 py-8 border-t">
          <h2 className="text-lg font-semibold leading-tight">Reading Progress</h2>
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
