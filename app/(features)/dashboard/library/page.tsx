'use client';

import { useState, useLayoutEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { BooksList } from '../components/BooksList';
import { Button } from '@/app/components/ui/button';
import { AddBookForm } from '../components/AddBookForm';
import { useDashboardStore } from '../stores/useDashboardStore';
import { Library, LayoutDashboard } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

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
      <div className="p-6">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
            { label: 'Library', path: '/dashboard/library', icon: <Library className="h-4 w-4" /> },
          ]}
        />
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
