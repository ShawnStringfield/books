import { Button } from '@/app/components/ui/button';
import { Highlighter, BookText } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useRecentHighlights } from '@/app/hooks/useRecentHighlights';
import HighlightCard from './HighlightCard';

interface RecentHighlightsProps {
  limit?: number;
  className?: string;
}

function EmptyHighlightState() {
  return (
    <div className="group rounded-lg border border-mono-subtle/40 bg-white p-2 shadow-sm transition-shadow hover:shadow-md h-[350px] flex flex-col justify-center">
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
  );
}

const RecentHighlights = memo(({ limit = 5, className }: RecentHighlightsProps) => {
  const { recentHighlights, totalHighlights, highlightsThisMonth } = useRecentHighlights(limit);

  const highlightsList = useMemo(
    () => recentHighlights.map((highlight) => <HighlightCard key={highlight.id} highlight={highlight} variant="verbose" />),
    [recentHighlights]
  );

  return (
    <div className={`${className || ''}`}>
      {recentHighlights.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Highlighter className="w-5 h-5" />
              Recent Highlights ({totalHighlights})
            </h2>
            <div className="text-sm text-gray-500">
              <span>{highlightsThisMonth} highlights this month</span>
            </div>
          </div>
          <div className="space-y-4">
            {highlightsList}
            {totalHighlights > 5 && (
              <Button variant="outline" className="w-full text-sm font-medium text-gray-700 hover:bg-gray-50">
                View all highlights
              </Button>
            )}
          </div>
        </div>
      ) : (
        <EmptyHighlightState />
      )}
    </div>
  );
});

RecentHighlights.displayName = 'RecentHighlights';

export default RecentHighlights;
