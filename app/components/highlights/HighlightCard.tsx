import { memo, useMemo, useCallback } from 'react';
import type { EnrichedHighlight } from '@/app/stores/useBookStore';
import { formatRelativeDate } from '@/app/utils/dateUtils';
import { BookText, Heart, Trash2 } from 'lucide-react';
import { useBookStore } from '@/app/stores/useBookStore';
import { Button } from '@/app/components/ui/button';

interface HighlightCardProps {
  highlight: EnrichedHighlight;
  variant?: 'default' | 'verbose';
}

export const EmptyHighlightState = memo(() => (
  <div className="text-center space-y-4 py-6">
    <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
      <BookText className="w-6 h-6 text-indigo-600" />
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Capture Your First Highlight</h3>
      <p className="text-sm text-gray-600 max-w-xs mx-auto">
        Save memorable quotes, insights, and passages from your books. They&apos;ll appear here for easy reference.
      </p>
    </div>
  </div>
));

EmptyHighlightState.displayName = 'EmptyHighlightState';

const HighlightCard = memo(({ highlight, variant = 'default' }: HighlightCardProps) => {
  const dateInfo = useMemo(() => formatRelativeDate(highlight.createdAt), [highlight.createdAt]);
  const toggleFavorite = useBookStore((state) => state.toggleFavoriteHighlight);
  const deleteHighlight = useBookStore((state) => state.deleteHighlight);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(highlight.id);
  }, [highlight.id, toggleFavorite]);

  const handleDelete = useCallback(() => {
    deleteHighlight(highlight.id);
  }, [highlight.id, deleteHighlight]);

  return (
    <div className="group rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col h-full space-y-4">
        <div className="flex items-center gap-2">
          {variant === 'verbose' && (
            <>
              <span className="text-xs text-gray-500 font-medium">{highlight.bookTitle}</span>
              <span className="text-xs text-gray-500">·</span>
              <span className="text-xs text-gray-500">{highlight.readingProgress}% complete</span>
            </>
          )}
        </div>
        <p className="text-gray-900 text-sm leading-normal">&ldquo;{highlight.text}&rdquo;</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <span className="bg-gray-50 px-2 py-1 rounded-full">
                Page {highlight.page} of {highlight.bookTotalPages}
              </span>
              {highlight.isFavorite && <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full">Favorite</span>}
            </div>
            <time dateTime={dateInfo.iso} className="text-gray-500 font-medium whitespace-nowrap">
              {dateInfo.formatted}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-500 transition-colors"
              onClick={handleToggleFavorite}
              aria-label={highlight.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${highlight.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-500 transition-colors"
              onClick={handleDelete}
              aria-label="Delete highlight"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

HighlightCard.displayName = 'HighlightCard';

export default HighlightCard;
