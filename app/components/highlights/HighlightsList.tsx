import { useHighlightsByBook } from '@/app/hooks/highlights/useHighlights';
import { useMemo } from 'react';
import HighlightCard from './HighlightCard';
import { Highlighter } from 'lucide-react';

interface HighlightsListProps {
  bookId: string;
  limit?: number;
}

function EmptyHighlightState() {
  return (
    <div className="text-center py-8">
      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
        <Highlighter className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Highlights Yet</h3>
      <p className="text-sm text-gray-600">Start capturing your favorite moments from this book.</p>
    </div>
  );
}

const HighlightsList = ({ bookId, limit }: HighlightsListProps) => {
  const { data: highlights = [], isLoading } = useHighlightsByBook(bookId);

  const sortedHighlights = useMemo(() => {
    if (limit) {
      return highlights.slice(0, limit);
    }
    return highlights;
  }, [highlights, limit]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (sortedHighlights.length === 0) {
    return <EmptyHighlightState />;
  }

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold leading-tight text-slate-500">
          {limit ? `Recent Highlights (${sortedHighlights.length})` : `Highlights (${sortedHighlights.length})`}
        </h2>
        <div className="grid gap-4">
          {sortedHighlights.map((highlight) => (
            <HighlightCard key={highlight.id} highlight={highlight} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HighlightsList;
