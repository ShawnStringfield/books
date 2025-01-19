import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/app/components/ui/sheet";
import { Book } from "@/app/stores/types";
import { useId, useState } from "react";
import ReadingProgressBar from "../ReadingProgressBar";
import { useRouter } from "next/navigation";
import BookHighlights from "@/app/components/highlights/BookHighlights";
import { Button } from "@/app/components/ui/button";
import { Loader2 } from "lucide-react";
import ReadingControls from "@/app/components/book/ReadingControls";
import { calculatePercentComplete } from "@/app/lib/utils/bookUtils";
import { useDeleteBook } from "@/app/hooks/books/useBooks";
import {
  useHighlightsByBook,
  useUpdateHighlight,
  useDeleteHighlight,
  useHighlightActions,
} from "@/app/hooks/highlights/useHighlights";
import BookProgressManager from "../BookProgressManager";
import { BookDetailsSheetHeader } from "./BookDetailsSheetHeader";
import { BookDetailsContent } from "./BookDetailsContent";
import { BookHighlightsSummary } from "./BookHighlightsSummary";

interface BookDetailsSheetProps {
  book: Book;
  books?: Book[];
  children?: React.ReactNode;
}

const BookDetailsSheet = ({ book, children }: BookDetailsSheetProps) => {
  const router = useRouter();
  const uniqueId = useId();
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(
    null,
  );
  const [editedText, setEditedText] = useState("");
  const deleteBookMutation = useDeleteBook();
  const { data: highlights = [] } = useHighlightsByBook(book.id || "");
  const updateHighlightMutation = useUpdateHighlight();
  const [highlightToDelete, setHighlightToDelete] = useState<string | null>(
    null,
  );
  const deleteHighlightMutation = useDeleteHighlight();
  const { toggleFavorite } = useHighlightActions();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Early return if no book id
  if (!book.id) {
    return null;
  }

  // After this point, book.id is definitely defined
  const bookId: string = book.id;

  const handleDelete = () => {
    deleteBookMutation.mutate(bookId, {
      onSuccess: () => {
        router.push("/dashboard/library");
      },
      onError: (error) => {
        console.error("Failed to delete book:", error);
      },
    });
  };

  const handleToggleFavorite = (highlight: {
    id: string;
    isFavorite: boolean;
  }) => {
    toggleFavorite.mutate({
      highlightId: highlight.id,
      isFavorite: !highlight.isFavorite,
      bookId: bookId,
    });
  };

  const handleEdit = (highlight: { id: string; text: string }) => {
    setEditingHighlightId(highlight.id);
    setEditedText(highlight.text);
  };

  const handleSave = (highlight: { id: string }) => {
    if (editedText.trim()) {
      updateHighlightMutation.mutate({
        highlightId: highlight.id,
        updates: {
          text: editedText.trim(),
        },
      });
      setEditingHighlightId(null);
      setEditedText("");
    }
  };

  const handleCancel = () => {
    setEditingHighlightId(null);
    setEditedText("");
  };

  const handleDeleteHighlight = (highlightId: string) => {
    deleteHighlightMutation.mutate(highlightId);
    setHighlightToDelete(null);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <button className="w-full text-left">
            <ReadingProgressBar
              currentPage={book.currentPage}
              totalPages={book.totalPages}
              progress={calculatePercentComplete(
                book.currentPage,
                book.totalPages,
              )}
              variant="bleed"
            />
          </button>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetTitle className="sr-only">{book.title} Details</SheetTitle>
        <BookProgressManager book={book}>
          {({
            handleProgressChange,
            handleStatusChange,
            handleTotalPagesUpdate,
            showReadingControls,
            showHighlightForm,
            manualTotalPages,
            toggleReadingControls,
            toggleHighlightForm,
            setManualTotalPages,
          }) => (
            <>
              <div className="flex flex-col h-full">
                <ReadingProgressBar
                  currentPage={book.currentPage}
                  totalPages={book.totalPages}
                  progress={calculatePercentComplete(
                    book.currentPage,
                    book.totalPages,
                  )}
                  variant="bleed"
                />

                <BookDetailsSheetHeader
                  onReadingControlsClick={toggleReadingControls}
                  onHighlightClick={toggleHighlightForm}
                  onDeleteClick={() => setShowDeleteConfirm(true)}
                  showReadingControls={showReadingControls}
                  showHighlights={showHighlightForm}
                />

                <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                  {showDeleteConfirm && (
                    <div className="py-4 px-4 mb-4 bg-red-50 rounded-lg border border-red-100">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Are you sure you want to delete &quot;{book.title}
                          &quot;? This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={deleteBookMutation.isPending}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            disabled={deleteBookMutation.isPending}
                          >
                            {deleteBookMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete Book"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <BookDetailsContent book={book} />

                  {highlights.length > 0 &&
                    !showHighlightForm &&
                    !showReadingControls && (
                      <BookHighlightsSummary
                        highlights={highlights}
                        onToggleFavorite={handleToggleFavorite}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onDelete={handleDeleteHighlight}
                        onShowDeleteConfirm={setHighlightToDelete}
                        onViewAll={toggleHighlightForm}
                        editingHighlightId={editingHighlightId}
                        editedText={editedText}
                        highlightToDelete={highlightToDelete}
                        onTextChange={setEditedText}
                        isDeleting={deleteHighlightMutation.isPending}
                        isUpdating={updateHighlightMutation.isPending}
                      />
                    )}

                  {showReadingControls && (
                    <ReadingControls
                      bookId={bookId}
                      currentPage={book.currentPage}
                      totalPages={book.totalPages}
                      status={book.status}
                      uniqueId={uniqueId}
                      variant="desktop"
                      onStatusChange={(bookId: string, status) =>
                        handleStatusChange(bookId, status)
                      }
                      onProgressChange={handleProgressChange}
                      onCancel={() => toggleReadingControls()}
                      manualTotalPages={manualTotalPages}
                      onManualTotalPagesChange={setManualTotalPages}
                      onTotalPagesUpdate={handleTotalPagesUpdate}
                      fromGoogle={book.fromGoogle}
                    />
                  )}

                  {showHighlightForm && (
                    <BookHighlights
                      bookId={bookId}
                      currentPage={book.currentPage}
                      showForm={showHighlightForm}
                      onClose={() => toggleHighlightForm()}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </BookProgressManager>
      </SheetContent>
    </Sheet>
  );
};

export default BookDetailsSheet;
