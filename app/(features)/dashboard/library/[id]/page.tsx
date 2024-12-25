"use client";

import { useParams, useRouter } from "next/navigation";
import { type Book } from "@/app/stores/types";
import { useState, useEffect } from "react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import BookHighlights from "@/app/components/highlights/BookHighlights";
import ReadingProgressBar from "@/app/components/book/ReadingProgressBar";
import { EditModeProvider, useEditMode } from "@/app/contexts/EditModeContext";
import { calculatePercentComplete } from "@/app/utils/bookUtils";
import ReadingControls from "@/app/components/book/ReadingControls";
import {
  useBook,
  useBooks,
  useDeleteBook,
  useUpdateBook,
} from "@/app/hooks/books/useBooks";
import { DeleteBookDialog } from "@/app/components/dialogs/DeleteBookDialog";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import { BookHeader } from "@/app/components/book/details/BookHeader";
import { BookMetadata } from "@/app/components/book/details/BookMetadata";
import { BookDescription } from "@/app/components/book/details/BookDescription";
import { BookProgressSection } from "@/app/components/book/details/BookProgressSection";
import { BookDetailsSkeleton } from "@/app/components/book/details/BookDetailsSkeleton";
import { useBookProgress } from "@/app/hooks/books/useBookProgress";
import { Button } from "@/app/components/ui/button";

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
        <BookDetailsSkeleton />
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

  return (
    <DashboardLayout>
      <ReadingProgressBar
        currentPage={validatedBook.currentPage || 0}
        totalPages={validatedBook.totalPages || 0}
        progress={calculatePercentComplete(
          validatedBook.currentPage,
          validatedBook.totalPages
        )}
        variant="bleed"
        className="relative -mt-[1px] bg-white overflow-visible"
      />

      <div className="p-6 pb-12 max-w-4xl mx-auto space-y-8">
        <BookHeader
          book={validatedBook}
          showEditControls={showEditControls}
          showReadingControls={showReadingControls}
          showHighlightForm={showHighlightForm}
          onReadingControlsClick={toggleReadingControls}
          onHighlightClick={toggleHighlightForm}
          onEditClick={toggleEditControls}
          onDeleteClick={() => setShowDeleteWarning(true)}
          onCancelEdit={toggleEditControls}
          onSaveChanges={handleSaveChanges}
        />

        <DeleteBookDialog
          isOpen={showDeleteWarning}
          onClose={() => setShowDeleteWarning(false)}
          onConfirm={handleDelete}
          bookTitle={validatedBook.title}
        />

        <BookMetadata
          book={validatedBook}
          showEditControls={showEditControls}
          onGenreChange={setEditedGenre}
        />

        {showHighlightForm && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <BookHighlights
              bookId={validatedBook.id}
              currentPage={validatedBook.currentPage || 0}
              showForm={true}
              onClose={() => toggleHighlightForm()}
            />
          </div>
        )}

        {showReadingControls && (
          <div className="bg-gray-50 rounded-lg p-6 space-y-6 border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Reading Controls</h2>
              {bookProgress.isUpdating && (
                <div className="text-sm text-gray-500">Saving changes...</div>
              )}
              {bookProgress.error && (
                <div className="text-sm text-red-500">
                  Failed to save changes. Please try again.
                </div>
              )}
            </div>

            <ReadingControls
              bookId={validatedBook.id}
              currentPage={validatedBook.currentPage || 0}
              totalPages={validatedBook.totalPages || 0}
              status={validatedBook.status}
              uniqueId={id}
              variant="mobile"
              onStatusChange={(
                bookId: string,
                status: "not-started" | "in-progress" | "completed"
              ) => handleStatusChange(status)}
              onProgressChange={(value: number[]) =>
                handleProgressChange(value[0])
              }
              onCancel={() => toggleReadingControls()}
              isLastBook={isLastBook}
              manualTotalPages={manualTotalPages}
              onManualTotalPagesChange={setManualTotalPages}
              onTotalPagesUpdate={handleTotalPagesUpdate}
              fromGoogle={validatedBook.fromGoogle || false}
            />
          </div>
        )}

        <BookDescription
          book={validatedBook}
          showEditControls={showEditControls}
          onDescriptionChange={setEditedDescription}
        />

        <div className="space-y-4 py-8">
          <BookHighlights
            bookId={validatedBook.id}
            currentPage={validatedBook.currentPage || 0}
            showForm={false}
            onClose={() => toggleHighlightForm()}
            className="space-y-4"
          />
        </div>

        <BookProgressSection book={validatedBook} />
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
