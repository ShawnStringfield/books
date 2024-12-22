import { BookX, BookOpen, CheckCircle } from 'lucide-react';
import { ReadingStatus, ReadingStatusType } from '@/app/stores/types';

export interface StatusOption {
  value: ReadingStatusType;
  label: string;
  icon: JSX.Element;
}

export const readingStatusOptions: StatusOption[] = [
  { value: ReadingStatus.NOT_STARTED, label: 'Not Started', icon: <BookX className="h-3.5 w-3.5" /> },
  { value: ReadingStatus.IN_PROGRESS, label: 'In Progress', icon: <BookOpen className="h-3.5 w-3.5" /> },
  { value: ReadingStatus.COMPLETED, label: 'Completed', icon: <CheckCircle className="h-3.5 w-3.5" /> },
];
