interface ReadingProgressBarProps {
  currentPage: number;
  totalPages: number;
  progress: number;
  className?: string;
  variant?: 'default' | 'minimal' | 'bleed';
}

const ReadingProgressBar = ({ currentPage, totalPages, progress, className = '', variant = 'default' }: ReadingProgressBarProps) => {
  if (variant === 'bleed') {
    return (
      <div className="absolute top-0 left-0 right-0 h-1.5">
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent">
          <div
            className="h-full bg-blue-500/90 transition-all duration-300 ease-out backdrop-blur-sm"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Reading progress: ${progress}%`}
          />
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`h-full bg-gray-200 ${className}`}>
        <div
          className="h-full bg-blue-600/80 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Reading progress: ${progress}%`}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>
          {currentPage} of {totalPages} pages
        </span>
        <span>{progress}% complete</span>
      </div>
    </div>
  );
};

export default ReadingProgressBar;
