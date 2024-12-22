import { cn } from '@/lib/utils';
import { ReadingStatus } from '@/app/stores/types';
import { StatusOption, readingStatusOptions } from '@/app/config/readingStatusConfig';

export interface StatusButtonsProps {
  bookId: string;
  currentStatus: (typeof ReadingStatus)[keyof typeof ReadingStatus];
  onStatusChange: (bookId: string, status: (typeof ReadingStatus)[keyof typeof ReadingStatus]) => void;
  size?: 'default' | 'small' | 'xs';
  align?: 'left' | 'center' | 'right';
  className?: string;
  statusOptions?: StatusOption[];
}

const StatusButtons = ({
  bookId,
  currentStatus,
  onStatusChange,
  size = 'xs',
  align = 'left',
  className,
  statusOptions = readingStatusOptions,
}: StatusButtonsProps) => {
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
