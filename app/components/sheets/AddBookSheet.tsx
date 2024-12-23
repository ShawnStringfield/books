import { Button } from '@/app/components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/app/components/ui/sheet';
import { AddBookForm } from '../book/AddBookForm';

interface AddBookSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: 'first' | 'new';
}

export function AddBookSheet({ isOpen, onOpenChange, variant = 'new' }: AddBookSheetProps) {
  const isFirstBook = variant === 'first';

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 px-0 font-semibold hover:bg-transparent hover:text-blue-600">
          <PlusCircle className="h-4 w-4 mr-1.5" />
          {isFirstBook ? 'Add Your First Book' : 'Add New Book'}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[540px] md:max-w-[600px] lg:max-w-[640px] p-0 h-[100dvh] bg-white border-l border-gray-200 shadow-xl"
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 h-14 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Add New Book</h2>
            <SheetClose className="rounded-full p-2 hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
            <AddBookForm onCancel={() => onOpenChange(false)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
