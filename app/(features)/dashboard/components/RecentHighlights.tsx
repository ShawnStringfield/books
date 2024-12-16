import { Button } from '@/app/components/ui/button';
import { BookText, Highlighter } from 'lucide-react';
import { useDashboardStore } from '../stores/useDashboardStore';
import { formatDistanceToNow } from 'date-fns';
import { Highlight } from '../types/books';

interface RecentHighlightsProps {
  highlights: Highlight[];
  highlightsThisMonth: number;
}

const RecentHighlights = ({ highlights, highlightsThisMonth }: RecentHighlightsProps) => {
  const { books } = useDashboardStore();
  const recentHighlights = [...highlights].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="my-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <h2 className="text-lg font-semibold">Recent Highlights ({highlights.length})</h2>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Highlighter className="w-4 h-4" />
          <span>{highlightsThisMonth} highlights this month</span>
        </div>
      </div>

      <div>
        {recentHighlights.length > 0 ? (
          <div>
            <div className="grid gap-4">
              {recentHighlights.map((highlight) => (
                <div key={highlight.id} className="group rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col h-full">
                    <span className="text-gray-500 font-medium text-sm mb-2">{books.find((b) => b.id === highlight.bookId)?.title}</span>
                    <p className="text-gray-900 text-sm leading-normal mb-3">&ldquo;{highlight.text}&rdquo;</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-50">
                      <span className="bg-gray-50 px-2 py-1 rounded-full">Page {highlight.page}</span>
                      <time dateTime={new Date(highlight.createdAt).toISOString()} className="text-gray-500 font-medium whitespace-nowrap">
                        {formatDistanceToNow(new Date(highlight.createdAt), { addSuffix: true })}
                      </time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {highlights.length > 5 && (
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
};

function EmptyRecentHighlightsState() {
  return (
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
  );
}

export default RecentHighlights;
