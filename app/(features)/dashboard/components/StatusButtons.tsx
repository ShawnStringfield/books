import { cn } from '@/lib/utils';
import { ReadingStatus } from '../types/books';
import { BookX, BookOpen, CheckCircle } from 'lucide-react';

export interface StatusButtonsProps {
  bookId: string;
  currentStatus: ReadingStatus;
  onStatusChange: (bookId: string, status: ReadingStatus) => void;
  size?: 'default' | 'small' | 'xs';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const statusOptions: { value: ReadingStatus; label: string; icon: React.ReactNode }[] = [
  { value: ReadingStatus.NOT_STARTED, label: 'Not Started', icon: <BookX className="h-3.5 w-3.5" /> },
  { value: ReadingStatus.IN_PROGRESS, label: 'In Progress', icon: <BookOpen className="h-3.5 w-3.5" /> },
  { value: ReadingStatus.COMPLETED, label: 'Completed', icon: <CheckCircle className="h-3.5 w-3.5" /> },
];

const StatusButtons = ({ bookId, currentStatus, onStatusChange, size = 'xs', align = 'left', className }: StatusButtonsProps) => {
  return (
    <div
      className={cn(
        'flex w-full',
        align === 'left' && 'justify-start',
        align === 'center' && 'justify-center',
        align === 'right' && 'justify-end',
        className
      )}
    >
      <div className="inline-flex gap-4">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusChange(bookId, option.value)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950',
              size === 'default' && 'text-sm',
              size === 'small' && 'text-sm',
              size === 'xs' && 'text-xs',
              currentStatus === option.value ? 'text-slate-900 font-medium' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusButtons;
