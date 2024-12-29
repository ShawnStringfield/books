import { Button } from "@/app/components/ui/button";
import { Library } from "lucide-react";
import { Book } from "@/app/stores/types";
import { useBookStore } from "@/app/stores/useBookStore";
import BookCard from "./BookCard";
import { DeleteBookDialog } from "@/app/components/dialogs/DeleteBookDialog";
import { useState } from "react";
import { AddBookSheet } from "../sheets/AddBookSheet";
import {
  useDeleteBook,
  useUpdateReadingStatus,
} from "@/app/hooks/books/useBooks";

interface CurrentlyReadingProps {
  books: Book[];
  className?: string;
}

const CurrentlyReading = ({ books, className }: CurrentlyReadingProps) => {
  const deleteBookMutation = useDeleteBook();
  const updateStatusMutation = useUpdateReadingStatus();
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (bookToDelete) {
      deleteBookMutation.mutate(bookToDelete);
      setBookToDelete(null);
    }
  };

  const handleStatusChange = (bookId: string, status: Book["status"]) => {
    updateStatusMutation.mutate({ bookId, status });
  };

  return (
    <div className={className}>
      {books.length > 0 ? (
        <>
          <div
            className={`grid gap-4 ${books.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} w-full`}
          >
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onStatusChange={handleStatusChange}
                onDelete={(id) => setBookToDelete(id)}
              />
            ))}
          </div>

          <DeleteBookDialog
            isOpen={!!bookToDelete}
            onClose={() => setBookToDelete(null)}
            onConfirm={handleDelete}
            bookTitle={books.find((b) => b.id === bookToDelete)?.title || ""}
          />
        </>
      ) : (
        <EmptyReadingState hasBooks={books.length > 0} className={className} />
      )}
    </div>
  );
};

function EmptyReadingState({
  hasBooks,
  className,
}: {
  hasBooks: boolean;
  className?: string;
}) {
  const { isAddBookSheetOpen, setAddBookSheetOpen } = useBookStore();

  return (
    <div
      className={`group rounded-lg border border-mono-subtle/40 bg-white p-2 shadow-sm transition-shadow hover:shadow-md h-[350px] flex flex-col justify-center ${
        className || ""
      }`}
    >
      <div className="text-center space-y-4">
        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
          <Library className="w-6 h-6 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {!hasBooks
              ? "No Books Currently Being Read"
              : "Start Your Reading Journey"}
          </h3>
          <p className="text-sm text-gray-600 max-w-xs mx-auto">
            {!hasBooks
              ? "Browse your library to continue reading a book or add a new one to your collection."
              : "Track your reading progress, collect meaningful highlights, and discover new books to read."}
          </p>
        </div>
        {!hasBooks ? (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild variant="outline" className="mt-4">
              <a href="/dashboard/library">Choose from Library</a>
            </Button>
            <Button onClick={() => setAddBookSheetOpen(true)} className="mt-4">
              Add New Book
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <AddBookSheet
              isOpen={isAddBookSheetOpen}
              onOpenChange={setAddBookSheetOpen}
              variant="first"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CurrentlyReading;
