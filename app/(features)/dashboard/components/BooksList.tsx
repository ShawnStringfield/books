import { useMemo } from 'react';
import { ReadingStatus } from '../types/books';
import { useDashboardStore } from '../stores/useDashboardStore';
import { formatDate } from '../utils/dateUtils';

export function BooksList() {
  const books = useDashboardStore((state) => state.books);
  const updateBookStatus = useDashboardStore((state) => state.updateBookStatus);

  const sortedBooks = useMemo(() => {
    return [...books].sort((a, b) => {
      // Sort by status (In Progress first, then Not Started, then Completed)
      const statusOrder = {
        [ReadingStatus.IN_PROGRESS]: 0,
        [ReadingStatus.NOT_STARTED]: 1,
        [ReadingStatus.COMPLETED]: 2,
      };

      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [books]);

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No books added yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sortedBooks.map((book) => (
        <div key={book.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2">
                <a href={`/dashboard/books/${book.id}`} className="hover:text-blue-600 transition-colors">
                  {book.title}
                </a>
              </h3>
              <p className="text-sm text-gray-600 mt-1">{book.author}</p>
            </div>
            <select
              value={book.status}
              onChange={(e) => updateBookStatus(book.id, e.target.value as ReadingStatus)}
              className="text-sm border rounded-md px-2 py-1"
              aria-label={`Update status for ${book.title}`}
            >
              {Object.values(ReadingStatus).map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <div className="flex justify-between items-center">
              <span>
                Pages: {book.currentPage} / {book.totalPages}
              </span>
              {book.completedDate && <span>Completed: {formatDate(book.completedDate)}</span>}
            </div>
            {book.highlights?.length > 0 && <div className="mt-1">Highlights: {book.highlights.length}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
