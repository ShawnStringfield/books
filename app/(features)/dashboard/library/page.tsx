"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import { BooksList } from "@/app/components/book/BooksList";
import { Plus } from "lucide-react";
import { AddBookForm } from "@/app/components/book/AddBookForm";
import Toolbar, { ToolbarAction } from "@/app/components/dashboard/Toolbar";
import { useBooks } from "@/app/hooks/books/useBooks";
import { useAuth } from "@/app/contexts/AuthContext";

export default function LibraryPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: books = [], isLoading: booksLoading, error } = useBooks();
  const [isAddingBook, setIsAddingBook] = useState(false);

  const toolbarActions: ToolbarAction[] = [
    {
      icon: Plus,
      label: "Add Book",
      onClick: () => setIsAddingBook(true),
      disabled: isAddingBook,
      variant: "default",
    },
  ];

  const isLoading = authLoading || booksLoading;
  const errorMessage =
    error instanceof Error
      ? error.message
      : "An error occurred while loading books";
  const hasBooks = Array.isArray(books) && books.length > 0;
  const showEmptyState = !hasBooks && !isLoading && !error;

  if (!user && !authLoading) {
    return (
      <DashboardLayout title="My Library">
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600">
              Please sign in to access your library.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Library">
      <div
        className={`max-w-4xl mx-auto p-6 ${
          showEmptyState ? "h-[calc(100vh-80px)] flex flex-col" : ""
        }`}
      >
        {hasBooks && (
          <div className="mb-6">
            <Toolbar actions={toolbarActions} />
          </div>
        )}

        {isAddingBook && (
          <div className="mb-6">
            <AddBookForm
              onSuccess={() => {
                setIsAddingBook(false);
              }}
              onCancel={() => setIsAddingBook(false)}
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-12">{errorMessage}</div>
        ) : (
          <div
            className={
              !hasBooks ? "flex-1 flex items-center justify-center" : ""
            }
          >
            <BooksList />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
