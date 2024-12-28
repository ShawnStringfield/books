"use client";

import { useParams, useRouter } from "next/navigation";
import { type Book } from "@/app/stores/types";
import { useState, useEffect } from "react";
import { EditModeProvider, useEditMode } from "@/app/contexts/EditModeContext";
import {
  useBook,
  useBooks,
  useDeleteBook,
  useUpdateBook,
} from "@/app/hooks/books/useBooks";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import { BookDescription } from "@/app/components/book/details/BookDescription";
import { BookDetailsSkeleton } from "@/app/components/book/details/BookDetailsSkeleton";
import { useBookProgress } from "@/app/hooks/books/useBookProgress";
import { Button } from "@/app/components/ui/button";
import { BookHeader } from "@/app/components/book/details/BookHeader";
import { ReadingControlsSection } from "@/app/components/book/details/ReadingControlsSection";
import { HighlightsSection } from "@/app/components/book/details/HighlightsSection";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import { calculatePercentComplete } from "@/app/lib/utils/bookUtils";
import ReadingProgressBar from "@/app/components/book/ReadingProgressBar";
import WarningAlert from "@/app/components/ui/warning-alert";
import BookToolbar from "@/app/components/book/BookToolbar";

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
  const updateBookMutation = useUpdateBook();
  const isLastBook = books.length === 1;
  const { showEditControls, toggleEditControls } = useEditMode();
  const [editedDescription, setEditedDescription] = useState("");
  const [editedGenre, setEditedGenre] = useState("");
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  // Redirect if no id is provided
  useEffect(() => {
    if (!id) {
      router.push("/dashboard/library");
    }
  }, [id, router]);

  // Initialize book progress hook with a default empty book if data is loading
  const bookProgress = useBookProgress(
    book && book.id
      ? (book as Required<Book>)
      : ({
          id: "",
          title: "",
          author: "",
          subtitle: "",
          description: "",
          isbn: "",
          publisher: "",
          publishedDate: "",
          publishDate: new Date().toISOString(),
          startDate: new Date().toISOString(),
          completedDate: new Date().toISOString(),
          categories: [],
          imageLinks: {},
          language: "en",
          previewLink: "",
          infoLink: "",
          canonicalVolumeLink: "",
          status: "NOT_STARTED",
          currentPage: 0,
          totalPages: 0,
          genre: "",
          fromGoogle: false,
          coverUrl: "",
          highlights: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as unknown as Required<Book>)
  );

  // Show loading state if data is being fetched
  if (isBooksLoading || isBookLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 pb-12 max-w-4xl mx-auto space-y-8">
          <BookDetailsSkeleton />
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

  // Type assertion after validation
  const validatedBook = book as Required<Book>;

  const {
    showReadingControls,
    showHighlightForm,
    manualTotalPages,
    handleProgressChange,
    handleStatusChange,
    handleTotalPagesUpdate,
    toggleReadingControls,
    toggleHighlightForm,
    setManualTotalPages,
    isUpdating,
    error,
  } = bookProgress;

  const handleDelete = () => {
    if (!isLastBook) {
      deleteBookMutation.mutate(validatedBook.id, {
        onSuccess: () => {
          router.push("/dashboard/library");
        },
      });
    }
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
      updateBookMutation.mutate({
        bookId: validatedBook.id,
        updates,
      });
    }

    setEditedDescription("");
    setEditedGenre("");
    toggleEditControls();
  };

  const deleteBookActions = [
    {
      label: "Cancel",
      onClick: () => setShowDeleteWarning(false),
      variant: "ghost" as const,
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive" as const,
    },
  ];

  return (
    <DashboardLayout>
      <ReadingProgressBar
        currentPage={book.currentPage || 0}
        totalPages={book.totalPages || 0}
        progress={calculatePercentComplete(book.currentPage, book.totalPages)}
        variant="bleed"
        className="relative -mt-[1px] bg-white overflow-visible"
      />
      <div className="p-6 pb-12 max-w-4xl mx-auto space-y-6">
        <BookToolbar
          onReadingControlsClick={toggleReadingControls}
          onHighlightClick={toggleHighlightForm}
          onEditClick={toggleEditControls}
          onDeleteClick={() => setShowDeleteWarning(true)}
          showReadingControls={showReadingControls}
          showHighlights={showHighlightForm}
          className="flex items-center gap-3 mt-2"
          variant="page"
        />
        {showReadingControls && (
          <ReadingControlsSection
            book={validatedBook}
            isLastBook={isLastBook}
            manualTotalPages={manualTotalPages}
            onStatusChange={handleStatusChange}
            onProgressChange={handleProgressChange}
            onCancel={toggleReadingControls}
            onManualTotalPagesChange={setManualTotalPages}
            onTotalPagesUpdate={handleTotalPagesUpdate}
            isUpdating={isUpdating}
            error={error}
          />
        )}
        {showHighlightForm && (
          <HighlightsSection
            book={validatedBook}
            showForm={true}
            onClose={toggleHighlightForm}
          />
        )}
        {showDeleteWarning && (
          <WarningAlert
            message={`Are you sure you want to delete "${validatedBook.title}"? This action cannot be undone.`}
            actions={deleteBookActions}
            variant="danger"
          />
        )}

        <BookHeader
          book={validatedBook}
          showEditControls={showEditControls}
          onCancelEdit={toggleEditControls}
          onSaveChanges={handleSaveChanges}
          onGenreChange={setEditedGenre}
        />

        <BookDescription
          book={validatedBook}
          showEditControls={showEditControls}
          onDescriptionChange={setEditedDescription}
        />

        <HighlightsSection
          book={validatedBook}
          showForm={false}
          onClose={toggleHighlightForm}
        />
      </div>
    </DashboardLayout>
  );
}

export default function BookDetailsPage() {
  return (
    <ErrorBoundary>
      <EditModeProvider>
        <BookDetailsContent />
      </EditModeProvider>
    </ErrorBoundary>
  );
}
