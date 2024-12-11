import { ReadingStatus } from '../types/books';

interface StatusButtonsProps {
  bookId: string;
  currentStatus: ReadingStatus;
  onStatusChange: (bookId: string, status: ReadingStatus) => void;
}

const StatusButtons = ({ bookId, currentStatus, onStatusChange }: StatusButtonsProps) => {
  return (
    <div className="flex items-center gap-1">
      {Object.values(ReadingStatus).map((status) => {
        // Format status text for display and aria-label
        const formattedStatus = status
          .replace('_', ' ')
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const isActive = currentStatus === status;

        const buttonClasses = `
          px-2 py-1 text-[12px] rounded-full transition-colors
          ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'}
        `;

        return (
          <button
            key={status}
            onClick={() => onStatusChange(bookId, status)}
            className={buttonClasses}
            aria-label={`Set status to ${formattedStatus.toLowerCase()}`}
            aria-pressed={isActive}
          >
            {formattedStatus}
          </button>
        );
      })}
    </div>
  );
};

export default StatusButtons;
