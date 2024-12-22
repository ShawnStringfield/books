import { useBookStore, selectEnrichedHighlights } from '../stores/useBookStore';
import { useMemo } from 'react';
import HighlightCard, { EmptyHighlightState } from './HighlightCard';
import { getBookHighlightsSorted } from '../utils/bookUtils';

interface HighlightsListProps {
  bookId: string;
  limit?: number;
}

const HighlightsList = ({ bookId, limit }: HighlightsListProps) => {
  const enrichedHighlights = useBookStore(selectEnrichedHighlights);

  const highlights = useMemo(() => {
    return getBookHighlightsSorted(enrichedHighlights, bookId, limit);
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
