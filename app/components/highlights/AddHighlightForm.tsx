import { Button } from '@/app/components/ui/button';
import { useBookStore } from '@/app/stores/useBookStore';
import { useState, useCallback } from 'react';
import { Highlighter } from 'lucide-react';

interface AddHighlightFormProps {
  bookId: string;
  currentPage: number;
  onClose: () => void;
}

const AddHighlightForm = ({ bookId, currentPage, onClose }: AddHighlightFormProps) => {
  const [newHighlight, setNewHighlight] = useState('');
  const addHighlight = useBookStore((state) => state.addHighlight);

  const handleAddHighlight = useCallback(() => {
    if (!newHighlight.trim()) return;

    addHighlight(bookId, {
      text: newHighlight,
      page: currentPage || 0,
      isFavorite: false,
    });
    setNewHighlight('');
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [addHighlight, bookId, currentPage, newHighlight, onClose]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Highlighter className="w-5 h-5 text-slate-500" />
        <h2 className="text-lg font-semibold leading-tight text-slate-500">Add New Highlight</h2>
      </div>
      <textarea
        value={newHighlight}
        onChange={(e) => setNewHighlight(e.target.value)}
        placeholder="Add a highlight from your current page..."
        className="w-full px-3 py-2 border rounded-lg min-h-[200px] text-[16px] focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
        aria-label="New highlight text"
        autoFocus={false}
      />
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleAddHighlight} disabled={!newHighlight.trim()} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
          Add Highlight
        </Button>
      </div>
    </div>
  );
};

export default AddHighlightForm;
