import { useBookStore, selectEnrichedHighlights } from '../stores/useBookStore';
import { useMemo } from 'react';
import HighlightCard, { EmptyHighlightState } from './HighlightCard';
import { safeDate } from '@/app/utils/dateUtils';

interface HighlightsListProps {
  bookId: string;
  limit?: number;
}

const HighlightsList = ({ bookId, limit }: HighlightsListProps) => {
  const enrichedHighlights = useBookStore(selectEnrichedHighlights);

  const highlights = useMemo(() => {
    const bookHighlights = enrichedHighlights
      .filter((h) => h.bookId === bookId)
      .sort((a, b) => {
        const dateA = safeDate(a.createdAt)?.getTime() ?? 0;
        const dateB = safeDate(b.createdAt)?.getTime() ?? 0;
        return dateB - dateA;
      });
    return limit ? bookHighlights.slice(0, limit) : bookHighlights;
  }, [enrichedHighlights, bookId, limit]);

  if (highlights.length === 0) {
    return <EmptyHighlightState />;
  }

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold leading-tight text-slate-500">
          {limit ? `Recent Highlights (${highlights.length})` : `Highlights (${highlights.length})`}
        </h2>
        <div className="grid gap-4">
          {highlights.map((highlight) => (
            <HighlightCard key={highlight.id} highlight={highlight} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HighlightsList;
