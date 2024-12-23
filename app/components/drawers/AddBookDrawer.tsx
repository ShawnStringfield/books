import { Button } from '@/app/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/app/components/ui/drawer';
import { AddBookForm } from '../book/AddBookForm';

interface AddBookDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: 'first' | 'new';
}

export function AddBookDrawer({ isOpen, onOpenChange, variant = 'new' }: AddBookDrawerProps) {
  const isFirstBook = variant === 'first';

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button className="mt-4 flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          {isFirstBook ? 'Add Your First Book' : 'Add New Book'}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] p-0">
        <div className="h-full overflow-hidden">
          <div className="h-full overflow-y-auto overscroll-contain px-4 pb-8 pt-4">
            <AddBookForm onCancel={() => onOpenChange(false)} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
