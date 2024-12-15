import { Button } from '@/app/components/ui/button';
import { useDashboardStore } from '../stores/useDashboardStore';
import { useState, useCallback } from 'react';

interface AddHighlightFormProps {
  bookId: string;
  currentPage: number;
}

const AddHighlightForm = ({ bookId, currentPage }: AddHighlightFormProps) => {
  const [newHighlight, setNewHighlight] = useState('');
  const addHighlight = useDashboardStore((state) => state.addHighlight);

  const handleAddHighlight = useCallback(() => {
    if (!newHighlight.trim()) return;

    addHighlight(bookId, {
      text: newHighlight,
      page: currentPage || 0,
      isFavorite: false,
    });
    setNewHighlight('');
  }, [addHighlight, bookId, currentPage, newHighlight]);

  return (
    <div className="space-y-2">
      <textarea
        value={newHighlight}
        onChange={(e) => setNewHighlight(e.target.value)}
        placeholder="Add a highlight from your current page..."
        className="w-full px-3 py-2 border rounded-lg min-h-[100px] text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        aria-label="New highlight text"
      />
      <Button onClick={handleAddHighlight} disabled={!newHighlight.trim()} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Add Highlight
      </Button>
    </div>
  );
};

export default AddHighlightForm;
