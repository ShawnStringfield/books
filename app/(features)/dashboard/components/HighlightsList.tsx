import { Heart, HeartIcon, Trash2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useDashboardStore } from '../stores/useDashboardStore';
import { useCallback, useMemo } from 'react';

interface HighlightsListProps {
  bookId: string;
}

const HighlightsList = ({ bookId }: HighlightsListProps) => {
  const deleteHighlight = useDashboardStore((state) => state.deleteHighlight);
  const toggleFavoriteHighlight = useDashboardStore((state) => state.toggleFavoriteHighlight);
  const allHighlights = useDashboardStore((state) => state.highlights);

  // Memoize filtered and sorted highlights
  const highlights = useMemo(() => {
    return allHighlights.filter((h) => h.bookId === bookId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allHighlights, bookId]);

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

  if (highlights.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-gray-400 mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900">No highlights yet</h3>
        <p className="mt-1 text-sm text-gray-500">Add your first highlight to keep track of important passages</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold leading-tight text-slate-500">Highlights</h2>
        {highlights.map((highlight) => (
          <div key={highlight.id} className="group relative p-4 bg-white rounded-lg border border-gray-200">
            <div className="space-y-2">
              <p className="text-gray-800 text-sm pr-4">{highlight.text}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Page {highlight.page} • {formatDistanceToNow(new Date(highlight.createdAt), { addSuffix: true })}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(highlight.id)}
                    className={`text-slate-600 hover:text-slate-900 hover:bg-transparent p-0 h-auto ${highlight.isFavorite ? 'text-slate-900' : ''}`}
                    aria-label={highlight.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {highlight.isFavorite ? <Heart className="h-4 w-4 fill-current" /> : <HeartIcon className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteHighlight(highlight.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-transparent p-0 h-auto"
                    aria-label="Delete highlight"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighlightsList;
