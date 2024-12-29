import { useState } from "react";
import { DeleteBookDialog } from "@/app/components/dialogs/DeleteBookDialog";
import BookCard from "./BookCard";
import { ReadingStatusType } from "@/app/stores/types";
import { Button } from "@/app/components/ui/button";
import { Library, PlusCircle, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/app/components/ui/sheet";
import { AddBookForm } from "./AddBookForm";
import {
  useBooks,
  useDeleteBook,
  useUpdateReadingStatus,
} from "@/app/hooks/books/useBooks";

interface BooksListProps {
  showCovers?: boolean;
  variant?: "avatar" | "full";
}

function EmptyLibraryState() {
  const [isAddBookSheetOpen, setAddBookSheetOpen] = useState(false);

  return (
    <div className="group rounded-lg border border-mono-subtle/40 bg-white p-8 shadow-sm transition-shadow hover:shadow-md max-w-lg w-full">
      <div className="text-center space-y-6">
        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
          <Library className="w-6 h-6 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Start Your Reading Journey</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Track your reading progress, collect meaningful highlights, and
            discover new books to read.
          </p>
        </div>
        <div className="flex justify-center">
          <Sheet open={isAddBookSheetOpen} onOpenChange={setAddBookSheetOpen}>
            <SheetTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Your First Book
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0">
              <div className="h-full overflow-hidden">
                <div className="flex items-center justify-between px-6 h-14 border-b border-gray-100">
                  <h2 className="text-lg font-semibold">Add New Book</h2>
                  <SheetClose className="rounded-full p-2 hover:bg-gray-100 transition-colors">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                </div>
                <div className="h-[calc(100%-3.5rem)] overflow-y-auto overscroll-contain px-6 pb-8 pt-6">
                  <AddBookForm
                    onCancel={() => setAddBookSheetOpen(false)}
                    onSuccess={() => setAddBookSheetOpen(false)}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

export function BooksList({
  showCovers = false,
  variant = "avatar",
}: BooksListProps) {
  const { data: books = [], isLoading, error } = useBooks();
  const deleteBookMutation = useDeleteBook();
  const updateStatusMutation = useUpdateReadingStatus();
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (bookToDelete) {
      deleteBookMutation.mutate(bookToDelete);
      setBookToDelete(null);
    }
  };

  const handleStatusChange = (bookId: string, status: ReadingStatusType) => {
    updateStatusMutation.mutate({ bookId, status });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-12">
        {error instanceof Error
          ? error.message
          : "An error occurred while loading books"}
      </div>
    );
  }

  if (books.length === 0) {
    return <EmptyLibraryState />;
  }

  return (
    <div className="w-full" role="list" aria-label="Books list">
      <div
        className={`grid gap-4 ${books.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} w-full`}
      >
        {books.map((book) => (
          <div key={book.id} className="w-full" role="listitem">
            <BookCard
              book={book}
              onStatusChange={handleStatusChange}
              onDelete={(id) => setBookToDelete(id)}
              className="border-transparent hover:border-blue-200 transition-colors duration-200"
              showCover={showCovers}
              variant={variant}
            />
          </div>
        ))}
      </div>

      <DeleteBookDialog
        isOpen={!!bookToDelete}
        onClose={() => setBookToDelete(null)}
        onConfirm={handleDelete}
        bookTitle={books.find((b) => b.id === bookToDelete)?.title || ""}
      />
    </div>
  );
}
