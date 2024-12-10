'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDashboardStore } from '../../stores/useDashboardStore';
import { Button } from '@/app/components/ui/button';
import { ReadingStatus } from '../../types/books';
import { Card, CardContent } from '@/app/components/ui/card';
import { useBookStatus } from '@/app/hooks/useBookStatus';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Highlight } from '../../types/books';
import { formatDate } from '../../utils/dateUtils';
import { Trash2, Star, StarOff } from 'lucide-react';
import { DeleteBookDialog } from '../../components/DeleteBookDialog';
import { selectIsLastBook } from '../../stores/useDashboardStore';
import DashboardLayout from '../../components/DashboardLayout';

export default function BookDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { books, highlights, updateBookStatus, updateReadingProgress, addHighlight, deleteBook, deleteHighlight, toggleFavoriteHighlight } =
    useDashboardStore();
  const { canChangeStatus, changeBookStatus } = useBookStatus(books);
  const book = books.find((b) => b.id === id);
  const [newHighlight, setNewHighlight] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isLastBook = useDashboardStore(selectIsLastBook);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!book) return <div>Book not found</div>;

  const handleStatusChange = async (newStatus: ReadingStatus) => {
    if (await changeBookStatus(book, newStatus)) {
      updateBookStatus(book.id, newStatus);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = parseInt(e.target.value);
    if (!isNaN(newPage) && newPage >= 0 && newPage <= book.totalPages) {
      updateReadingProgress(book.id, newPage);
    }
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;

    addHighlight(book.id, {
      text: newHighlight,
      page: book.currentPage,
      isFavorite: false,
    });
    setNewHighlight('');
  };

  const handleDeleteBook = () => {
    if (!isLastBook) {
      deleteBook(book.id);
      router.push('/dashboard/books');
    }
  };

  // Get highlights for this book
  const bookHighlights = highlights.filter((h) => h.bookId === id);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-full mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isLastBook}
            title={isLastBook ? 'Cannot delete the last book' : undefined}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Book
            {isLastBook && <span className="ml-2 text-sm">(Cannot delete last book)</span>}
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex gap-6">
              {book.coverUrl && <Image src={book.coverUrl} alt={book.title} width={150} height={225} className="object-cover rounded-lg" />}
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">{book.title}</h1>
                <p className="text-gray-600">{book.author}</p>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Reading Progress</label>
                  <input
                    type="number"
                    value={book.currentPage}
                    onChange={handleProgressChange}
                    className="w-24 px-3 py-2 border rounded-md"
                    min={0}
                    max={book.totalPages}
                  />
                  <p className="text-sm text-gray-600">
                    of {book.totalPages} pages ({Math.round((book.currentPage / book.totalPages) * 100)}%)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Status</label>
                  <div className="flex gap-2">
                    {Object.values(ReadingStatus).map((status) => (
                      <Button
                        key={status}
                        disabled={!canChangeStatus(book, status)}
                        variant={book.status === status ? 'default' : 'outline'}
                        onClick={() => handleStatusChange(status)}
                        size="sm"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">Highlights</h2>

              <div className="space-y-2">
                <textarea
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add a new highlight..."
                  className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                  aria-label="New highlight text"
                />
                <Button onClick={handleAddHighlight} disabled={!newHighlight.trim()} className="w-full">
                  Add Highlight
                </Button>
              </div>

              <div className="space-y-4">
                {bookHighlights.map((highlight: Highlight) => (
                  <div key={highlight.id} className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800">{highlight.text}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavoriteHighlight(highlight.id)}
                          className="text-yellow-500 hover:text-yellow-600"
                          aria-label={highlight.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {highlight.isFavorite ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHighlight(highlight.id)}
                          className="text-red-500 hover:text-red-600"
                          aria-label="Delete highlight"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Page {highlight.page} • {isClient ? formatDate(highlight.createdAt) : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <DeleteBookDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleDeleteBook} bookTitle={book.title} />
      </div>
    </DashboardLayout>
  );
}
