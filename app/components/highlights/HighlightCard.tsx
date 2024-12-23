import { memo, useMemo, useCallback, useState } from 'react';
import Link from 'next/link';
import type { EnrichedHighlight } from '@/app/stores/useBookStore';
import { formatRelativeDate } from '@/app/utils/dateUtils';
import { BookText, Heart, Trash2, Pencil, Check, X } from 'lucide-react';
import { useBookStore } from '@/app/stores/useBookStore';
import { Button } from '@/app/components/ui/button';

interface HighlightCardProps {
  highlight: EnrichedHighlight;
  variant?: 'default' | 'verbose';
}

export const EmptyHighlightState = memo(() => (
  <div className="group rounded-lg border border-mono-subtle/40 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
    <div className="text-center space-y-4">
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
  </div>
));

EmptyHighlightState.displayName = 'EmptyHighlightState';

const HighlightCard = memo(({ highlight, variant = 'default' }: HighlightCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(highlight.text);
  const dateInfo = useMemo(() => formatRelativeDate(highlight.modifiedAt || highlight.createdAt), [highlight.modifiedAt, highlight.createdAt]);
  const toggleFavorite = useBookStore((state) => state.toggleFavoriteHighlight);
  const deleteHighlight = useBookStore((state) => state.deleteHighlight);
  const updateHighlight = useBookStore((state) => state.updateHighlight);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(highlight.id);
  }, [highlight.id, toggleFavorite]);

  const handleDelete = useCallback(() => {
    deleteHighlight(highlight.id);
  }, [highlight.id, deleteHighlight]);

  const handleStartEdit = useCallback(() => {
    setEditText(highlight.text);
    setIsEditing(true);
  }, [highlight.text]);

  const handleSaveEdit = useCallback(() => {
    if (editText.trim() !== '') {
      updateHighlight(highlight.id, editText.trim());
      setIsEditing(false);
    }
  }, [highlight.id, editText, updateHighlight]);

  const handleCancelEdit = useCallback(() => {
    setEditText(highlight.text);
    setIsEditing(false);
  }, [highlight.text]);

  return (
    <div className="group rounded-lg border border-mono-subtle/40 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col h-full space-y-4">
        <div className="flex items-center gap-2">
          {variant === 'verbose' && (
            <>
              <Link
                href={`/dashboard/library/${highlight.bookId}`}
                className="text-xs text-brand-emphasis font-medium hover:text-brand-emphasis transition-colors"
              >
                {highlight.bookTitle}
              </Link>
              <span className="text-xs text-mono/75">·</span>
              <span className="text-xs text-mono/75">{highlight.readingProgress}% complete</span>
            </>
          )}
        </div>
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
              aria-label="Edit highlight text"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-900" aria-label="Cancel edit">
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveEdit}
                className="text-indigo-600 hover:text-indigo-900"
                aria-label="Save edit"
                disabled={editText.trim() === ''}
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-normal text-mono-emphasis">{highlight.text}</p>
        )}
        <div className="flex justify-between items-center text-xs text-mono/75">
          <div className="flex items-center gap-2">
            <span className="">
              Page {highlight.page} of {highlight.bookTotalPages}
            </span>
            <span className="">·</span>
            <time dateTime={dateInfo.iso} className="font-medium whitespace-nowrap">
              {dateInfo.formatted}
            </time>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:text-indigo-500 transition-colors"
              onClick={handleStartEdit}
              aria-label="Edit highlight"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:text-red-500 transition-colors"
              onClick={handleToggleFavorite}
              aria-label={highlight.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${highlight.isFavorite ? 'fill-red-500 text-red-500' : 'text-red-500'}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:text-red-500 transition-colors"
              onClick={handleDelete}
              aria-label="Delete highlight"
            >
              <Trash2 className="w-4 h-4 text-red-300" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

HighlightCard.displayName = 'HighlightCard';

export default HighlightCard;
