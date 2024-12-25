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
import { DeleteBookDialog } from "@/app/components/dialogs/DeleteBookDialog";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import { BookMetadata } from "@/app/components/book/details/BookMetadata";
import { BookDescription } from "@/app/components/book/details/BookDescription";
import { BookProgressSection } from "@/app/components/book/details/BookProgressSection";
import { BookDetailsSkeleton } from "@/app/components/book/details/BookDetailsSkeleton";
import { useBookProgress } from "@/app/hooks/books/useBookProgress";
import { Button } from "@/app/components/ui/button";
import { BookDetailsLayout } from "@/app/components/book/details/BookDetailsLayout";
import { BookDetailsHeader } from "@/app/components/book/details/BookDetailsHeader";
import { ReadingControlsSection } from "@/app/components/book/details/ReadingControlsSection";
import { HighlightsSection } from "@/app/components/book/details/HighlightsSection";

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
      <BookDetailsLayout>
        <BookDetailsSkeleton />
      </BookDetailsLayout>
    );
  }

  if (!book || !book.id) {
    return (
      <BookDetailsLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <h1 className="text-2xl font-bold">Book not found</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/library")}
          >
            Return to Library
          </Button>
        </div>
      </BookDetailsLayout>
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

  return (
    <BookDetailsLayout>
      <BookDetailsHeader
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
        <HighlightsSection
          book={validatedBook}
          showForm={true}
          onClose={toggleHighlightForm}
        />
      )}

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

      <BookProgressSection book={validatedBook} />
    </BookDetailsLayout>
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
