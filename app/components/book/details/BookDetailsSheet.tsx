import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { Book } from "@/app/stores/types";
import { useId, useState } from "react";
import ReadingProgressBar from "../ReadingProgressBar";
import { useRouter } from "next/navigation";
import BookHighlights from "@/app/components/highlights/BookHighlights";
import { DeleteBookDialog } from "@/app/components/dialogs/DeleteBookDialog";
import ReadingControls from "@/app/components/book/ReadingControls";
import { calculatePercentComplete } from "@/app/utils/bookUtils";
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

const BookDetailsSheet = ({
  book,
  books = [],
  children,
}: BookDetailsSheetProps) => {
  const router = useRouter();
  const uniqueId = useId();
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(
    null
  );
  const [editedText, setEditedText] = useState("");
  const deleteBookMutation = useDeleteBook();
  const isLastBook = books.length === 1;
  const { data: highlights = [] } = useHighlightsByBook(book.id || "");
  const updateHighlightMutation = useUpdateHighlight();
  const [highlightToDelete, setHighlightToDelete] = useState<string | null>(
    null
  );
  const deleteHighlightMutation = useDeleteHighlight();
  const { toggleFavorite } = useHighlightActions();

  // Early return if no book id
  if (!book.id) {
    return null;
  }

  // After this point, book.id is definitely defined
  const bookId: string = book.id;

  const handleDelete = () => {
    if (!isLastBook) {
      deleteBookMutation.mutate(bookId);
      router.push("/dashboard/library");
    }
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
                book.totalPages
              )}
              variant="bleed"
            />
          </button>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <BookProgressManager book={book}>
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
              <div className="flex flex-col h-full">
                <ReadingProgressBar
                  currentPage={book.currentPage}
                  totalPages={book.totalPages}
                  progress={calculatePercentComplete(
                    book.currentPage,
                    book.totalPages
                  )}
                  variant="bleed"
                />

                <BookDetailsSheetHeader
                  onReadingControlsClick={toggleReadingControls}
                  onHighlightClick={toggleHighlightForm}
                  onDeleteClick={() => setShowDeleteWarning(true)}
                  showReadingControls={showReadingControls}
                  showHighlights={showHighlightForm}
                />

                <div className="flex-1 overflow-y-auto px-4 sm:px-6">
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

              <DeleteBookDialog
                isOpen={showDeleteWarning}
                onClose={() => setShowDeleteWarning(false)}
                onConfirm={handleDelete}
                bookTitle={book.title}
              />
            </>
          )}
        </BookProgressManager>
      </SheetContent>
    </Sheet>
  );
};

export default BookDetailsSheet;
