import { Eye, Link as LinkIcon, X, Trash2, Settings2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetDescription,
  SheetTitle,
  SheetClose,
  SheetHeader,
} from "@/app/components/ui/sheet";
import { Book, ReadingStatusType, ReadingStatus } from "@/app/stores/types";
import { useId, useState } from "react";
import ReadingProgressBar from "./ReadingProgressBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookHighlights from "@/app/components/highlights/BookHighlights";
import { DeleteBookDialog } from "@/app/components/dialogs/DeleteBookDialog";
import Toolbar, { ToolbarAction } from "@/app/components/dashboard/Toolbar";
import ReadingControls from "@/app/components/book/ReadingControls";
import { calculatePercentComplete } from "@/app/utils/bookUtils";
import {
  useDeleteBook,
  useUpdateReadingProgress,
  useBooks,
  useUpdateReadingStatus,
  useUpdateBook,
} from "@/app/hooks/books/useBooks";
import {
  useHighlightsByBook,
  useUpdateHighlight,
  useDeleteHighlight,
  useHighlightActions,
} from "@/app/hooks/highlights/useHighlights";
import HighlightCard from "@/app/components/highlights/HighlightCard";
import { useBookStatus } from "@/app/hooks/useBookStatus";

interface BookDetailsSheetProps {
  book: Book;
  children?: React.ReactNode;
}

const BookDetailsSheet = ({ book, children }: BookDetailsSheetProps) => {
  const router = useRouter();
  const uniqueId = useId();
  const [showHighlights, setShowHighlights] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReadingControls, setShowReadingControls] = useState(false);
  const [manualTotalPages, setManualTotalPages] = useState("");
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(
    null
  );
  const [editedText, setEditedText] = useState("");
  const { data: books = [] } = useBooks();
  const deleteBookMutation = useDeleteBook();
  const updateProgressMutation = useUpdateReadingProgress();
  const updateStatusMutation = useUpdateReadingStatus();
  const updateBookMutation = useUpdateBook();
  const isLastBook = books.length === 1;
  const { data: highlights = [] } = useHighlightsByBook(book.id || "");
  const updateHighlightMutation = useUpdateHighlight();
  const [highlightToDelete, setHighlightToDelete] = useState<string | null>(
    null
  );
  const deleteHighlightMutation = useDeleteHighlight();
  const { toggleFavorite } = useHighlightActions();
  const { changeBookStatus, isChangingStatus } = useBookStatus(
    books.map((b) => ({
      id: b.id!,
      title: b.title,
      status: b.status,
      currentPage: b.currentPage || 0,
      totalPages: b.totalPages || 0,
    }))
  );

  const handleDelete = () => {
    if (!isLastBook && book.id) {
      deleteBookMutation.mutate(book.id);
      router.push("/dashboard/library");
    }
  };

  const handleProgressChange = async (value: number[]) => {
    const newPage = value[0];
    if (book.id) {
      try {
        await updateProgressMutation.mutateAsync({
          bookId: book.id,
          currentPage: newPage,
        });

        // Update status based on progress
        if (newPage === 0 && book.status !== ReadingStatus.NOT_STARTED) {
          await handleStatusChange(book.id, ReadingStatus.NOT_STARTED);
        } else if (
          newPage === book.totalPages &&
          book.status !== ReadingStatus.COMPLETED
        ) {
          await handleStatusChange(book.id, ReadingStatus.COMPLETED);
        } else if (
          newPage > 0 &&
          newPage < book.totalPages &&
          book.status === ReadingStatus.NOT_STARTED
        ) {
          await handleStatusChange(book.id, ReadingStatus.IN_PROGRESS);
        }
      } catch (error) {
        console.error("Failed to update progress:", error);
      }
    }
  };

  const handleTotalPagesUpdate = async (value: number) => {
    if (value > 0 && book.id) {
      try {
        // Update total pages first
        await updateBookMutation.mutateAsync({
          bookId: book.id,
          updates: { totalPages: value },
        });

        // Then update the reading progress if needed
        const newCurrentPage = Math.min(book.currentPage || 0, value);
        if (newCurrentPage !== book.currentPage) {
          await updateProgressMutation.mutateAsync({
            bookId: book.id,
            currentPage: newCurrentPage,
          });
        }

        setManualTotalPages("");
        setShowReadingControls(false);
      } catch (error) {
        console.error("Failed to update book:", error);
      }
    }
  };

  const handleToggleFavorite = (highlight: {
    id: string;
    isFavorite: boolean;
  }) => {
    if (book.id) {
      toggleFavorite.mutate({
        highlightId: highlight.id,
        isFavorite: !highlight.isFavorite,
        bookId: book.id,
      });
    }
  };

  const handleEdit = (highlight: { id: string; text: string }) => {
    setEditingHighlightId(highlight.id);
    setEditedText(highlight.text);
  };

  const handleSave = (highlight: { id: string }) => {
    if (book.id && editedText.trim()) {
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
    if (book.id) {
      deleteHighlightMutation.mutate(highlightId);
      setHighlightToDelete(null);
    }
  };

  const handleStatusChange = async (
    bookId: string,
    newStatus: ReadingStatusType
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

  const toolbarActions: ToolbarAction[] = [
    {
      icon: Eye,
      label: "View Highlights",
      onClick: () => setShowHighlights(!showHighlights),
      variant: showHighlights ? "outline" : "default",
    },
    {
      icon: Settings2,
      label: "Reading Controls",
      onClick: () => setShowReadingControls(!showReadingControls),
      variant: showReadingControls ? "outline" : "default",
    },
    {
      icon: Trash2,
      label: "Delete Book",
      onClick: () => setShowDeleteDialog(true),
      variant: "destructive",
    },
  ];

  const description = `${book.title} by ${book.author}`;

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
              <Toolbar actions={toolbarActions} className="mt-8" />
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
                    href={`/dashboard/library/${book.id}`}
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
                    <p className="text-sm text-slate-600">{book.description}</p>
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
              !showHighlights &&
              !showReadingControls && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Highlights
                    </h3>
                    <button
                      onClick={() => setShowHighlights(true)}
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
                        showDeleteConfirm={highlightToDelete === highlight.id}
                        isDeleting={deleteHighlightMutation.isPending}
                        isUpdating={updateHighlightMutation.isPending}
                        onToggleFavorite={() => handleToggleFavorite(highlight)}
                        onDelete={() => handleDeleteHighlight(highlight.id)}
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
                bookId={book.id || ""}
                currentPage={book.currentPage}
                totalPages={book.totalPages}
                status={book.status}
                uniqueId={uniqueId}
                variant="desktop"
                onStatusChange={handleStatusChange}
                onProgressChange={handleProgressChange}
                onCancel={() => setShowReadingControls(false)}
                manualTotalPages={manualTotalPages}
                onManualTotalPagesChange={setManualTotalPages}
                onTotalPagesUpdate={handleTotalPagesUpdate}
                onDelete={() => setShowDeleteDialog(true)}
                isLastBook={isLastBook}
                fromGoogle={book.fromGoogle}
              />
            )}

            {showHighlights && (
              <BookHighlights
                bookId={book.id || ""}
                currentPage={book.currentPage}
                showForm={showHighlights}
                onClose={() => setShowHighlights(false)}
              />
            )}
          </div>
        </div>
      </SheetContent>

      <DeleteBookDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        bookTitle={book.title}
      />
    </Sheet>
  );
};

export default BookDetailsSheet;
