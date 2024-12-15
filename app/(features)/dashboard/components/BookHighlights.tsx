import AddHighlightForm from './AddHighlightForm';
import HighlightsList from './HighlightsList';

interface BookHighlightsProps {
  bookId: string;
  currentPage: number;
  showForm?: boolean;
}

const BookHighlights = ({ bookId, currentPage, showForm = false }: BookHighlightsProps) => {
  return (
    <div className="space-y-8">
      {showForm && <AddHighlightForm bookId={bookId} currentPage={currentPage} />}
      <HighlightsList bookId={bookId} />
    </div>
  );
};

export default BookHighlights;
