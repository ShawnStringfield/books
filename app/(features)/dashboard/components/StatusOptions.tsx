import { ReadingStatus } from '../types/books';

interface StatusButtonsProps {
  bookId: string;
  currentStatus: ReadingStatus;
  onStatusChange: (bookId: string, status: ReadingStatus) => void;
  variant?: 'default' | 'full-width';
  roundedVariant?: 'default' | 'compact';
}

const StatusButtons = ({ bookId, currentStatus, onStatusChange, variant = 'default', roundedVariant = 'default' }: StatusButtonsProps) => {
  return (
    <div className={`flex ${variant === 'full-width' ? 'w-full gap-3' : 'gap-2'}`}>
      {Object.values(ReadingStatus).map((status) => {
        const formattedStatus = status
          .replace('_', ' ')
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const isActive = currentStatus === status;
        const roundedClass = roundedVariant === 'compact' ? 'rounded-md' : 'rounded-full';

        const buttonClasses = `
          px-4 py-2 text-sm font-medium ${roundedClass} transition-colors
          ${variant === 'full-width' ? 'flex-1' : ''}
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
