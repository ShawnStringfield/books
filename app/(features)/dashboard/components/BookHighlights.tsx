import AddHighlightForm from './AddHighlightForm';
import HighlightsList from './HighlightsList';

interface BookHighlightsProps {
  bookId: string;
  currentPage: number;
  showForm?: boolean;
  formOnly?: boolean;
  listOnly?: boolean;
}

const BookHighlights = ({ bookId, currentPage, showForm = false, formOnly = false, listOnly = false }: BookHighlightsProps) => {
  return (
    <div className="space-y-8">
      {showForm && !listOnly && <AddHighlightForm bookId={bookId} currentPage={currentPage} />}
      {!formOnly && <HighlightsList bookId={bookId} />}
    </div>
  );
};

export default BookHighlights;
