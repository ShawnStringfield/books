import { Button } from '@/app/components/ui/button';
import { Highlighter } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useRecentHighlights } from '@/app/hooks/useRecentHighlights';
import HighlightCard, { EmptyHighlightState } from './HighlightCard';

interface RecentHighlightsProps {
  limit?: number;
}

const RecentHighlights = memo(({ limit = 5 }: RecentHighlightsProps) => {
  const { recentHighlights, totalHighlights, highlightsThisMonth } = useRecentHighlights(limit);

  const highlightsList = useMemo(
    () => recentHighlights.map((highlight) => <HighlightCard key={highlight.id} highlight={highlight} variant="verbose" />),
    [recentHighlights]
  );

  return (
    <div className="my-16">
      {recentHighlights.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Highlighter className="w-5 h-5" />
            Recent Highlights ({totalHighlights})
          </h2>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span>{highlightsThisMonth} highlights this month</span>
          </div>
        </div>
      )}

      <div>
        {recentHighlights.length > 0 ? (
          <div>
            <div className={`grid gap-4 ${recentHighlights.length > 1 ? 'md:grid-cols-2' : ''}`}>{highlightsList}</div>
            {totalHighlights > 5 && (
              <div className="mt-6">
                <Button variant="outline" className="w-full text-sm font-medium text-gray-700 hover:bg-gray-50">
                  View all highlights
                </Button>
              </div>
            )}
          </div>
        ) : (
          <EmptyHighlightState />
        )}
      </div>
    </div>
  );
});

RecentHighlights.displayName = 'RecentHighlights';

export default RecentHighlights;
