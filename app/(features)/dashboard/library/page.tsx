'use client';

import { useState, useLayoutEffect } from 'react';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { BooksList } from '@/app/components/book/BooksList';
import { Plus } from 'lucide-react';
import { AddBookForm } from '@/app/components/book/AddBookForm';
import { useBookStore } from '@/app/stores/useBookStore';
import Toolbar, { ToolbarAction } from '@/app/components/dashboard/Toolbar';

export default function LibraryPage() {
  const [mounted, setMounted] = useState(false);
  const isLoading = useBookStore((state) => state.isLoading);
  const error = useBookStore((state) => state.error);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const books = useBookStore((state) => state.books);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toolbarActions: ToolbarAction[] = [
    {
      icon: Plus,
      label: 'Add Book',
      onClick: () => setIsAddingBook(true),
      disabled: isAddingBook,
      variant: 'default',
    },
  ];

  return (
    <DashboardLayout title="My Library">
      <div className={`max-w-4xl mx-auto p-6 ${!books.length && !isLoading && !error ? 'h-[calc(100vh-80px)] flex flex-col' : ''}`}>
        {books.length > 0 && (
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
          <div className="text-red-600 text-center py-12">{error}</div>
        ) : (
          <div className={!books.length ? 'flex-1 flex items-center justify-center' : ''}>
            <BooksList />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
