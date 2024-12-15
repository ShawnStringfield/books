'use client';

import { useState, useLayoutEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { BooksList } from '../components/BooksList';
import { Button } from '@/app/components/ui/button';
import { AddBookForm } from '../components/AddBookForm';
import { useDashboardStore } from '../stores/useDashboardStore';

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

  return (
    <DashboardLayout title="My Library">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-end mb-6">
          <Button onClick={() => setIsAddingBook(true)} disabled={isAddingBook}>
            Add Book
          </Button>
        </div>

        {isAddingBook && (
          <div className="mb-6">
            <AddBookForm
              onSuccess={() => {
                setIsAddingBook(false);
                // Any other success handling
              }}
              onClose={() => setIsAddingBook(false)}
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
