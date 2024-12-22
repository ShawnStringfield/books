import { cn } from '@/lib/utils';
import { calculatePercentComplete } from '@/app/utils/bookUtils';

interface BookProgressPercentageProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

const BookProgressPercentage = ({ currentPage, totalPages, className }: BookProgressPercentageProps) => {
  const percentComplete = calculatePercentComplete(currentPage, totalPages);

  return <span className={cn('text-xs text-gray-500', className)}>{percentComplete}%</span>;
};

export default BookProgressPercentage;
