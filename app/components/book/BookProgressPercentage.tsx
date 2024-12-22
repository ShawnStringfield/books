import { cn } from '@/lib/utils';
import { calculatePercentComplete } from '@/app/utils/bookUtils';

type ProgressVariant = 'default' | 'verbose';

interface BookProgressPercentageProps {
  currentPage: number;
  totalPages: number;
  className?: string;
  variant?: ProgressVariant;
}

const BookProgressPercentage = ({ currentPage, totalPages, className, variant = 'default' }: BookProgressPercentageProps) => {
  const percentComplete = calculatePercentComplete(currentPage, totalPages);

  return (
    <span className={cn('text-xs text-gray-500', className)}>
      {percentComplete}%{variant === 'verbose' && ' Complete'}
    </span>
  );
};

export default BookProgressPercentage;
