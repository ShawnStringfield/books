import { memo, useMemo } from 'react';
import type { EnrichedHighlight } from '../stores/useBookStore';
import { formatRelativeDate } from '@/app/utils/dateUtils';
import { BookText } from 'lucide-react';

interface HighlightCardProps {
  highlight: EnrichedHighlight;
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

const HighlightCard = memo(({ highlight }: HighlightCardProps) => {
  const dateInfo = useMemo(() => formatRelativeDate(highlight.createdAt), [highlight.createdAt]);

  return (
    <div className="group rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <span className="text-gray-500 font-medium text-sm">{highlight.bookTitle}</span>
          <span className="text-xs text-gray-500">{highlight.readingProgress}% complete</span>
        </div>
        <p className="text-gray-900 text-sm leading-normal mb-3">&ldquo;{highlight.text}&rdquo;</p>
        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-50">
          <div className="flex gap-2">
            <span className="bg-gray-50 px-2 py-1 rounded-full">
              Page {highlight.page} of {highlight.bookTotalPages}
            </span>
            {highlight.isFavorite && <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">Favorite</span>}
          </div>
          <time dateTime={dateInfo.iso} className="text-gray-500 font-medium whitespace-nowrap">
            {dateInfo.formatted}
          </time>
        </div>
      </div>
    </div>
  );
});

HighlightCard.displayName = 'HighlightCard';

export default HighlightCard;
