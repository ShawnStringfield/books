import { Heart, HeartIcon, Trash2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useDashboardStore } from '../stores/useDashboardStore';
import { useState, useCallback, useMemo } from 'react';

interface BookHighlightsProps {
  bookId: string;
  currentPage: number;
}

const BookHighlights = ({ bookId, currentPage }: BookHighlightsProps) => {
  const [newHighlight, setNewHighlight] = useState('');
  const addHighlight = useDashboardStore((state) => state.addHighlight);
  const deleteHighlight = useDashboardStore((state) => state.deleteHighlight);
  const toggleFavoriteHighlight = useDashboardStore((state) => state.toggleFavoriteHighlight);
  const allHighlights = useDashboardStore((state) => state.highlights);

  // Memoize filtered highlights to prevent unnecessary recalculations
  const highlights = useMemo(() => {
    return allHighlights.filter((h) => h.bookId === bookId);
  }, [allHighlights, bookId]);

  const handleAddHighlight = useCallback(() => {
    if (!newHighlight.trim()) return;

    addHighlight(bookId, {
      text: newHighlight,
      page: currentPage || 0,
      isFavorite: false,
    });
    setNewHighlight('');
  }, [addHighlight, bookId, currentPage, newHighlight]);

  const handleToggleFavorite = useCallback(
    (highlightId: string) => {
      toggleFavoriteHighlight(highlightId);
    },
    [toggleFavoriteHighlight]
  );

  const handleDeleteHighlight = useCallback(
    (highlightId: string) => {
      deleteHighlight(highlightId);
    },
    [deleteHighlight]
  );

  return (
    <div className="space-y-8">
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

      {highlights.length > 0 && (
        <div className="">
          <h3 className="font-medium text-muted-foreground mb-4">Highlights</h3>
          <div className="space-y-4">
            {highlights.map((highlight) => (
              <div key={highlight.id} className="group relative p-4 bg-gray-50 rounded-lg space-y-2 hover:bg-gray-100 transition-all duration-200">
                <div className="flex justify-between items-start gap-4">
                  <p className="text-gray-800 text-sm">{highlight.text}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(highlight.id)}
                      className={`text-slate-600 hover:text-slate-700 ${highlight.isFavorite ? 'bg-slate-50' : ''}`}
                      aria-label={highlight.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {highlight.isFavorite ? <Heart className="h-4 w-4 fill-current" /> : <HeartIcon className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteHighlight(highlight.id)}
                      className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Delete highlight"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Page {highlight.page} • {formatDistanceToNow(new Date(highlight.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookHighlights;
