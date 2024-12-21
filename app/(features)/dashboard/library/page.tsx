'use client';

import { useState, useLayoutEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { BooksList } from '../components/BooksList';
import { Plus } from 'lucide-react';
import { AddBookForm } from '../components/AddBookForm';
import { useDashboardStore } from '../stores/useDashboardStore';
import Toolbar, { ToolbarAction } from '../components/Toolbar';

export default function LibraryPage() {
  const [mounted, setMounted] = useState(false);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const error = useDashboardStore((state) => state.error);
  const [isAddingBook, setIsAddingBook] = useState(false);

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
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Toolbar actions={toolbarActions} />
        </div>

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
          <BooksList />
        )}
      </div>
    </DashboardLayout>
  );
}
