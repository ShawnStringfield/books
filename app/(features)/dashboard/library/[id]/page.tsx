"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { type Book } from "@/app/stores/types";
import { useState, useEffect } from "react";
import { AlertCircle, ExternalLink, Info } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import BookHighlights from "@/app/components/highlights/BookHighlights";
import ReadingProgressBar from "@/app/components/book/ReadingProgressBar";
import EditableBookDescription from "@/app/components/book/EditableBookDescription";
import EditableGenre from "@/app/components/book/EditableGenre";
import { EditModeProvider, useEditMode } from "@/app/contexts/EditModeContext";
import { calculatePercentComplete } from "@/app/utils/bookUtils";
import { ReadingDates } from "@/app/components/book/book-metadata";
import ReadingControls from "@/app/components/book/ReadingControls";
import {
  useBook,
  useBooks,
  useDeleteBook,
  useUpdateBook,
} from "@/app/hooks/books/useBooks";
import BookToolbar from "@/app/components/book/BookToolbar";
import BookProgressManager from "@/app/components/book/BookProgressManager";

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

  // Type assertion after validation
  const validatedBook = book as Required<Book>;

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
      <BookProgressManager book={validatedBook} books={books}>
        {({
          handleProgressChange,
          handleStatusChange,
          handleTotalPagesUpdate,
          showReadingControls,
          showHighlightForm,
          manualTotalPages,
          showDeleteWarning,
          toggleReadingControls,
          toggleHighlightForm,
          setManualTotalPages,
          setShowDeleteWarning,
        }) => (
          <>
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
              <BookToolbar
                onReadingControlsClick={toggleReadingControls}
                onHighlightClick={toggleHighlightForm}
                onEditClick={toggleEditControls}
                onDeleteClick={() => setShowDeleteWarning(true)}
                showReadingControls={showReadingControls}
                showHighlights={showHighlightForm}
                className="flex items-center gap-3 mb-4"
                variant="page"
              />

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
                            onClick={handleDelete}
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
                  </div>

                  <ReadingControls
                    bookId={validatedBook.id}
                    currentPage={validatedBook.currentPage || 0}
                    totalPages={validatedBook.totalPages || 0}
                    status={validatedBook.status}
                    uniqueId={id}
                    variant="mobile"
                    onStatusChange={handleStatusChange}
                    onProgressChange={handleProgressChange}
                    onCancel={() => toggleReadingControls()}
                    isLastBook={isLastBook}
                    manualTotalPages={manualTotalPages}
                    onManualTotalPagesChange={setManualTotalPages}
                    onTotalPagesUpdate={handleTotalPagesUpdate}
                    fromGoogle={validatedBook.fromGoogle || false}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold leading-0">
                      {validatedBook.title}
                    </h1>
                    <h2 className="text-mono text-lg font-semibold leading-tight">
                      {validatedBook.subtitle}
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
                      By: {validatedBook.author} •{" "}
                      {validatedBook.totalPages || 0} pages
                    </p>
                    <div className="flex flex-col gap-1.5 mt-1">
                      <EditableGenre
                        genre={validatedBook.genre || ""}
                        bookId={validatedBook.id}
                        isEditing={showEditControls}
                        onChange={setEditedGenre}
                      />
                      <ReadingDates book={validatedBook} />
                      {!validatedBook.genre && !validatedBook.isbn && (
                        <span className="italic text-sm text-mono">
                          No additional details available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    {validatedBook.previewLink && (
                      <a
                        href={validatedBook.previewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-brand hover:text-blue-800 transition-colors"
                        aria-label="Preview book"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Preview
                      </a>
                    )}
                    {validatedBook.infoLink && (
                      <a
                        href={validatedBook.infoLink}
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

              <div className="space-y-4 pt-8">
                <h2 className="text-lg font-semibold leading-tight">
                  About This Book
                </h2>
                <EditableBookDescription
                  description={validatedBook.description || ""}
                  bookId={validatedBook.id}
                  isEditing={showEditControls}
                  onChange={setEditedDescription}
                />
              </div>

              <div className="space-y-4 py-8">
                <BookHighlights
                  bookId={validatedBook.id}
                  currentPage={validatedBook.currentPage || 0}
                  showForm={false}
                  onClose={() => toggleHighlightForm()}
                  className="space-y-4"
                />
              </div>

              <div className="space-y-4 py-8 border-t">
                <h2 className="text-lg font-semibold leading-tight">
                  Reading Progress
                </h2>
                <ReadingProgressBar
                  currentPage={validatedBook.currentPage || 0}
                  totalPages={validatedBook.totalPages}
                  progress={calculatePercentComplete(
                    validatedBook.currentPage,
                    validatedBook.totalPages
                  )}
                  variant="default"
                />
              </div>
            </div>
          </>
        )}
      </BookProgressManager>
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
