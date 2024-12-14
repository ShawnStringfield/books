import { useId } from 'react';

interface ReadingProgressBarProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

const ReadingProgressBar = ({ currentPage, totalPages, className = '' }: ReadingProgressBarProps) => {
  const uniqueId = useId();
  const progressLabelId = `progress-label-${uniqueId}`;
  const progressPercentage = Math.round((currentPage / totalPages) * 100);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div
            className="w-full bg-gray-200 rounded-full h-2.5"
            role="progressbar"
            aria-labelledby={progressLabelId}
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
        <span className="text-lg font-medium text-blue-900">{progressPercentage}%</span>
      </div>
      <div className="w-full bg-white sm:bg-transparent rounded-lg p-2 sm:p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div
              className="w-full bg-gray-200 rounded-full h-2.5"
              role="progressbar"
              aria-labelledby={progressLabelId}
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
          <span className="text-lg font-medium text-blue-900">{progressPercentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default ReadingProgressBar;
