import AddHighlightForm from './AddHighlightForm';
import HighlightsList from './HighlightsList';

interface BookHighlightsProps {
  bookId: string;
  currentPage: number;
  showForm: boolean;
  onClose: () => void;
  highlightLimit?: number;
}

const BookHighlights = ({ bookId, currentPage, showForm, onClose, highlightLimit }: BookHighlightsProps) => {
  return (
    <div className="space-y-8">
      {showForm && <AddHighlightForm bookId={bookId} currentPage={currentPage} onClose={onClose} />}
      {!showForm && <HighlightsList bookId={bookId} limit={highlightLimit} />}
    </div>
  );
};

export default BookHighlights;
