'use client';

import { useState, useLayoutEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { BooksList } from '../components/BooksList';
import { Button } from '@/app/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/app/components/ui/drawer';
import { AddBookForm } from '../components/AddBookForm';
import { useDashboardStore } from '../stores/useDashboardStore';

export default function BooksPage() {
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const error = useDashboardStore((state) => state.error);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Books</h1>
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Book
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Add New Book</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                <AddBookForm onSuccess={() => setIsDrawerOpen(false)} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>

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
