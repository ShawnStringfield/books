import { cn } from '@/lib/utils';
import { ReadingStatus } from '@/app/stores/types';
import { StatusOption, readingStatusOptions } from '@/app/config/readingStatusConfig';
import { AnimatedButton } from '@/app/components/ui/animated-button';

export interface StatusButtonsProps {
  bookId: string;
  currentStatus: (typeof ReadingStatus)[keyof typeof ReadingStatus];
  onStatusChange: (bookId: string, status: (typeof ReadingStatus)[keyof typeof ReadingStatus]) => void;
  size?: 'default' | 'sm' | 'lg';
  align?: 'left' | 'center' | 'right';
  className?: string;
  statusOptions?: StatusOption[];
}

const StatusButtons = ({
  bookId,
  currentStatus,
  onStatusChange,
  size = 'sm',
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
      <div className="grid w-full grid-cols-3 gap-1">
        {statusOptions.map((option) => (
          <AnimatedButton
            key={option.value}
            onClick={() => onStatusChange(bookId, option.value)}
            variant="ghost"
            size={size}
            transitionColors={{
              from: currentStatus === option.value ? 'bg-brand-muted/20' : 'bg-transparent',
              to: currentStatus === option.value ? 'bg-brand-surface' : 'bg-brand-subtle/20',
            }}
            className={cn(
              'h-7 w-full inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-sm',
              size === 'lg' && 'text-sm',
              size === 'default' && 'text-xs',
              size === 'sm' && 'text-[10px]',
              currentStatus === option.value ? 'text-brand-emphasis font-bold ' : 'text-mono hover:text-mono-strong'
            )}
          >
            <span className="shrink-0">{option.icon}</span>
            <span className="truncate">{option.label}</span>
          </AnimatedButton>
        ))}
      </div>
    </div>
  );
};

export default StatusButtons;
