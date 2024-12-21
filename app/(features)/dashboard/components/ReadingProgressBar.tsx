import { ProgressBar } from '@/app/components/progress/ProgressBar';
import { cn } from '@/app/utils/cn';

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
          <ProgressBar value={progress} />
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('h-full', className)}>
        <ProgressBar value={progress} />
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <ProgressBar value={progress} />
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
