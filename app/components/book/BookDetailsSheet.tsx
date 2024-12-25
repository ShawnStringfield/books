import { X, Link as LinkIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetDescription,
  SheetTitle,
  SheetClose,
  SheetHeader,
} from "@/app/components/ui/sheet";
import { Book, ReadingStatusType } from "@/app/stores/types";
import { useId, useState } from "react";
import ReadingProgressBar from "./ReadingProgressBar";
import Link from "next/link";
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
import HighlightCard from "@/app/components/highlights/HighlightCard";
import BookToolbar from "./BookToolbar";
import BookProgressManager from "./BookProgressManager";

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
  const description = `${book.title} by ${book.author}`;

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

                <SheetHeader className="px-4 sm:px-6 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <BookToolbar
                      onReadingControlsClick={toggleReadingControls}
                      onHighlightClick={toggleHighlightForm}
                      onDeleteClick={() => setShowDeleteWarning(true)}
                      showReadingControls={showReadingControls}
                      showHighlights={showHighlightForm}
                      className="mt-8"
                      variant="sheet"
                    />
                    <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </SheetClose>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6">
                    <div className="flex-grow">
                      <SheetTitle className="text-xl sm:text-2xl font-bold">
                        <Link
                          href={`/dashboard/library/${bookId}`}
                          className="hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {book.title}
                        </Link>
                      </SheetTitle>
                      <SheetDescription className="sr-only">
                        {description}
                      </SheetDescription>

                      <div className="space-y-8 mb-4">
                        <div>
                          {book.subtitle && (
                            <p className="text-sm sm:text-base mt-2">
                              {book.subtitle}
                            </p>
                          )}

                          <div className="flex items-center gap-2 my-2">
                            <p className="text-sm my-2 text-slate-500">
                              by {book.author}
                            </p>
                            <p className="text-sm text-slate-500">
                              • {book.totalPages} pages
                            </p>
                          </div>

                          {(book.previewLink || book.infoLink) && (
                            <div className="flex gap-4 mt-2 text-sm text-slate-600">
                              {book.previewLink && (
                                <a
                                  href={book.previewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                                >
                                  <LinkIcon className="w-3.5 h-3.5" />
                                  <span>Preview</span>
                                </a>
                              )}
                              {book.infoLink && (
                                <a
                                  href={book.infoLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                                >
                                  <LinkIcon className="w-3.5 h-3.5" />
                                  <span>More info</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        {book.description && (
                          <p className="text-sm text-slate-600">
                            {book.description}
                          </p>
                        )}

                        {book.categories && book.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {book.categories.map((category) => (
                              <span
                                key={category}
                                className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Highlights Summary Section */}
                  {highlights.length > 0 &&
                    !showHighlightForm &&
                    !showReadingControls && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-gray-900">
                            Highlights
                          </h3>
                          <button
                            onClick={toggleHighlightForm}
                            className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            View all
                          </button>
                        </div>
                        <div className="space-y-3">
                          {highlights.slice(0, 3).map((highlight) => (
                            <HighlightCard
                              key={highlight.id}
                              highlight={highlight}
                              isEditing={editingHighlightId === highlight.id}
                              editedText={
                                editingHighlightId === highlight.id
                                  ? editedText
                                  : highlight.text
                              }
                              showDeleteConfirm={
                                highlightToDelete === highlight.id
                              }
                              isDeleting={deleteHighlightMutation.isPending}
                              isUpdating={updateHighlightMutation.isPending}
                              onToggleFavorite={() =>
                                handleToggleFavorite(highlight)
                              }
                              onDelete={() =>
                                handleDeleteHighlight(highlight.id)
                              }
                              onEdit={() => handleEdit(highlight)}
                              onSave={() => handleSave(highlight)}
                              onCancel={handleCancel}
                              onTextChange={setEditedText}
                              onShowDeleteConfirm={(show) =>
                                setHighlightToDelete(show ? highlight.id : null)
                              }
                            />
                          ))}
                        </div>
                      </div>
                    )}

                  {showReadingControls && (
                    <ReadingControls
                      bookId={bookId}
                      currentPage={book.currentPage}
                      totalPages={book.totalPages}
                      status={book.status}
                      uniqueId={uniqueId}
                      variant="desktop"
                      onStatusChange={(
                        bookId: string,
                        status: ReadingStatusType
                      ) => handleStatusChange(bookId, status)}
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
