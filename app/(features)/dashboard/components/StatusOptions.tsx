import { cn } from '@/lib/utils';
import { ReadingStatus } from '../types/books';
import { BookX, BookOpen, CheckCircle } from 'lucide-react';

interface StatusButtonsProps {
  bookId: string;
  currentStatus: ReadingStatus;
  onStatusChange: (bookId: string, status: ReadingStatus) => void;
  size?: 'default' | 'small' | 'xs';
  roundedVariant?: 'full' | 'compact';
}

const statusOptions: { value: ReadingStatus; label: string; icon: React.ReactNode }[] = [
  { value: ReadingStatus.NOT_STARTED, label: 'Not Started', icon: <BookX className="h-3.5 w-3.5" /> },
  { value: ReadingStatus.IN_PROGRESS, label: 'In Progress', icon: <BookOpen className="h-3.5 w-3.5" /> },
  { value: ReadingStatus.COMPLETED, label: 'Completed', icon: <CheckCircle className="h-3.5 w-3.5" /> },
];

const StatusButtons = ({ bookId, currentStatus, onStatusChange, size = 'xs', roundedVariant = 'full' }: StatusButtonsProps) => {
  return (
    <div className="inline-flex p-0.5">
      {statusOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onStatusChange(bookId, option.value)}
          className={cn(
            'inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950',
            roundedVariant === 'full' ? 'rounded-md' : 'first:rounded-l-md last:rounded-r-md',
            size === 'default' && 'px-3 py-1.5 text-sm',
            size === 'small' && 'px-2.5 py-1 text-sm',
            size === 'xs' && 'px-2 py-0.5 text-xs',
            currentStatus === option.value ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default StatusButtons;
