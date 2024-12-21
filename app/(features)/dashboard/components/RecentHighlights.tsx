import { Button } from '@/app/components/ui/button';
import { BookText, Highlighter } from 'lucide-react';
import type { EnrichedHighlight } from '../stores/useBookStore';
import { memo, useMemo } from 'react';
import { useRecentHighlights } from '../hooks/useRecentHighlights';
import { formatRelativeDate } from '@/app/utils/dateUtils';

interface RecentHighlightsProps {
  limit?: number;
}

interface HighlightCardProps {
  highlight: EnrichedHighlight;
}

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

const EmptyRecentHighlightsState = memo(() => (
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

EmptyRecentHighlightsState.displayName = 'EmptyRecentHighlightsState';

const RecentHighlights = memo(({ limit = 5 }: RecentHighlightsProps) => {
  const { recentHighlights, totalHighlights, highlightsThisMonth } = useRecentHighlights(limit);

  const highlightsList = useMemo(
    () => recentHighlights.map((highlight) => <HighlightCard key={highlight.id} highlight={highlight} />),
    [recentHighlights]
  );

  return (
    <div className="my-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <h2 className="text-lg font-semibold">Recent Highlights ({totalHighlights})</h2>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Highlighter className="w-4 h-4" />
          <span>{highlightsThisMonth} highlights this month</span>
        </div>
      </div>

      <div>
        {recentHighlights.length > 0 ? (
          <div>
            <div className="grid gap-4">{highlightsList}</div>
            {totalHighlights > 5 && (
              <div className="mt-6">
                <Button variant="outline" className="w-full text-sm font-medium text-gray-700 hover:bg-gray-50">
                  View all highlights
                </Button>
              </div>
            )}
          </div>
        ) : (
          <EmptyRecentHighlightsState />
        )}
      </div>
    </div>
  );
});

RecentHighlights.displayName = 'RecentHighlights';

export default RecentHighlights;
