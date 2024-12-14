interface ReadingProgressBarProps {
  currentPage: number;
  totalPages: number;
  progress: number;
}

const ReadingProgressBar = ({ currentPage, totalPages, progress }: ReadingProgressBarProps) => {
  return (
    <div className="space-y-2">
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
