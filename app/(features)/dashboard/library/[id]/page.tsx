"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { ReadingStatus, type Book } from "@/app/stores/types";
import { useBookStatus } from "@/app/hooks/useBookStatus";
import { useState, useEffect } from "react";
import {
  Plus,
  Settings2,
  Pencil,
  ExternalLink,
  Info,
  AlertCircle,
  Trash2,
} from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import BookHighlights from "@/app/components/highlights/BookHighlights";
import ReadingProgressBar from "@/app/components/book/ReadingProgressBar";
import EditableBookDescription from "@/app/components/book/EditableBookDescription";
import EditableGenre from "@/app/components/book/EditableGenre";
import { EditModeProvider, useEditMode } from "@/app/contexts/EditModeContext";
import Toolbar, { ToolbarAction } from "@/app/components/dashboard/Toolbar";
import { calculatePercentComplete } from "@/app/utils/bookUtils";
import { ReadingDates } from "@/app/components/book/book-metadata";
import ReadingControls from "@/app/components/book/ReadingControls";
import {
  useBook,
  useBooks,
  useDeleteBook,
  useUpdateReadingStatus,
  useUpdateReadingProgress,
  useUpdateBook,
} from "@/app/hooks/books/useBooks";

// Type guard to ensure book has required properties
function assertValidBook(book: Book): asserts book is Book & { id: string } {
  if (!book.id) throw new Error("Book ID is required");
}

function BookDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";
  const { data: books = [], isLoading: isBooksLoading } = useBooks();
  const { data: book, isLoading: isBookLoading } = useBook(id);
  const deleteBookMutation = useDeleteBook();
  const updateStatusMutation = useUpdateReadingStatus();
  const updateProgressMutation = useUpdateReadingProgress();
  const updateBookMutation = useUpdateBook();
  const { changeBookStatus, isChangingStatus } = useBookStatus(
    books.map((b) => ({
      id: b.id!,
      title: b.title,
      status: b.status,
      currentPage: b.currentPage || 0,
      totalPages: b.totalPages || 0,
    }))
  );
  const isLastBook = books.length === 1;
  const { showEditControls, toggleEditControls } = useEditMode();
  const [editedDescription, setEditedDescription] = useState("");
  const [editedGenre, setEditedGenre] = useState("");
  const [showReadingControls, setShowReadingControls] = useState(false);
  const [showHighlightForm, setShowHighlightForm] = useState(false);
  const [manualTotalPages, setManualTotalPages] = useState<string>("");
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  // Redirect if no id is provided
  useEffect(() => {
    if (!id) {
      router.push("/dashboard/library");
    }
  }, [id, router]);

  // Show loading state if data is being fetched
  if (isBooksLoading || isBookLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!book || !book.id) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <h1 className="text-2xl font-bold">Book not found</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/library")}
          >
            Return to Library
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = () => {
    if (!isLastBook) {
      setShowDeleteWarning(true);
    } else {
      setShowDeleteWarning(true); // Show warning with different message for last book
    }
  };

  const confirmDelete = () => {
    if (!isLastBook) {
      deleteBookMutation.mutate(book.id!, {
        onSuccess: () => {
          router.push("/dashboard/library");
        },
      });
    }
    setShowDeleteWarning(false);
  };

  const toolbarActions: ToolbarAction[] = [
    {
      icon: Settings2,
      label: "Reading controls",
      onClick: () => setShowReadingControls(!showReadingControls),
    },
    {
      icon: Plus,
      label: "Add highlight",
      onClick: () => setShowHighlightForm(!showHighlightForm),
    },
    {
      icon: Pencil,
      label: "Toggle edit mode",
      onClick: toggleEditControls,
    },
    {
      icon: Trash2,
      label: "Delete book",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const handleStatusChange = async (
    bookId: string,
    newStatus: (typeof ReadingStatus)[keyof typeof ReadingStatus]
  ) => {
    if (isChangingStatus || !book.id) return;

    const bookForStatus = {
      id: book.id,
      title: book.title,
      status: book.status,
      currentPage: book.currentPage || 0,
      totalPages: book.totalPages || 0,
    };

    if (await changeBookStatus(bookForStatus, newStatus)) {
      updateStatusMutation.mutate({ bookId, status: newStatus });
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newPage = value[0];
    assertValidBook(book);
    // Update server state only
    updateProgressMutation.mutate({ bookId: book.id, currentPage: newPage });
  };

  const handleSaveChanges = () => {
    const updates: Partial<{
      description: string;
      genre: string;
    }> = {};

    if (editedDescription) {
      updates.description = editedDescription;
    }
    if (editedGenre) {
      updates.genre = editedGenre;
    }

    if (Object.keys(updates).length > 0) {
      assertValidBook(book);
      updateBookMutation.mutate({
        bookId: book.id,
        updates,
      });
    }

    setEditedDescription("");
    setEditedGenre("");
    toggleEditControls();
  };

  const handleTotalPagesUpdate = (value: number) => {
    if (value > 0) {
      assertValidBook(book);
      // First update the reading progress to ensure current page is valid
      const newCurrentPage = Math.min(book.currentPage || 0, value);
      updateProgressMutation.mutate({
        bookId: book.id,
        currentPage: newCurrentPage,
      });

      // Update total pages
      updateBookMutation.mutate({
        bookId: book.id,
        updates: { totalPages: value },
      });

      setManualTotalPages("");
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
        <Toolbar
          actions={toolbarActions}
          className="flex items-center gap-3 mb-4"
        />

        {/* Delete Warning */}
        {showDeleteWarning && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  {isLastBook
                    ? "Cannot delete the last book"
                    : "Delete this book?"}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    {isLastBook
                      ? "You must keep at least one book in your library."
                      : "This action cannot be undone. Are you sure you want to delete this book?"}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  {!isLastBook && (
                    <Button
                      onClick={confirmDelete}
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, delete book
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowDeleteWarning(false)}
                    variant="outline"
                    size="sm"
                  >
                    {isLastBook ? "Okay" : "Cancel"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Highlight Form */}
        {showHighlightForm && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <BookHighlights
              bookId={book.id}
              currentPage={book.currentPage || 0}
              showForm={true}
              onClose={() => setShowHighlightForm(false)}
            />
          </div>
        )}

        {/* Reading Controls Section */}
        {showReadingControls && (
          <div className="bg-gray-50 rounded-lg p-6 space-y-6 border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Reading Controls</h2>
            </div>

            <ReadingControls
              bookId={book.id}
              currentPage={book.currentPage || 0}
              totalPages={book.totalPages || 0}
              status={book.status}
              uniqueId={id}
              variant="mobile"
              onStatusChange={handleStatusChange}
              onProgressChange={handleProgressChange}
              onDelete={handleDelete}
              onCancel={() => setShowReadingControls(false)}
              isLastBook={isLastBook}
              manualTotalPages={manualTotalPages}
              onManualTotalPagesChange={(value) => setManualTotalPages(value)}
              onTotalPagesUpdate={handleTotalPagesUpdate}
              fromGoogle={book.fromGoogle}
            />
          </div>
        )}

        {/* Book Details */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold leading-0 ">{book.title}</h1>
              <h2 className="text-mono text-lg font-semibold leading-tight">
                {book.subtitle}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {showEditControls ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleEditControls}
                    className="text-xs py-1 px-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveChanges}
                    className="text-xs py-1 px-2 bg-brand"
                  >
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
                <EditableGenre
                  genre={book.genre || ""}
                  bookId={book.id}
                  isEditing={showEditControls}
                  onChange={setEditedGenre}
                />
                <ReadingDates book={book} />
                {!book.genre && !book.isbn && (
                  <span className="italic text-sm text-mono">
                    No additional details available
                  </span>
                )}
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
          <h2 className="text-lg font-semibold leading-tight">
            About This Book
          </h2>
          <EditableBookDescription
            description={book.description || ""}
            bookId={book.id}
            isEditing={showEditControls}
            onChange={setEditedDescription}
          />
        </div>

        {/* Book Highlights Section */}
        <div className="space-y-4 py-8">
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
          <h2 className="text-lg font-semibold leading-tight">
            Reading Progress
          </h2>
          <ReadingProgressBar
            currentPage={book.currentPage || 0}
            totalPages={book.totalPages}
            progress={calculatePercentComplete(
              book.currentPage,
              book.totalPages
            )}
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
