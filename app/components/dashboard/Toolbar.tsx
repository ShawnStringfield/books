import { Button } from '@/app/components/ui/button';
import { LucideIcon } from 'lucide-react';

export interface ToolbarAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  className?: string;
}

interface ToolbarProps {
  actions: ToolbarAction[];
  className?: string;
}

const Toolbar = ({ actions, className = '' }: ToolbarProps) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Button
            key={`${action.label}-${index}`}
            variant={action.variant || 'ghost'}
            size="icon"
            className={`rounded-full p-2 ${
              action.variant === 'destructive'
                ? 'text-destructive hover:text-destructive/90 bg-destructive/10 hover:bg-destructive/20'
                : 'text-brand-emphasis bg-brand-subtle hover:bg-brand-surface'
            } ${action.className || ''}`}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            <Icon className={`h-5 w-5 ${action.variant === 'destructive' ? 'text-destructive' : 'text-brand-textweak'}`} />
            <span className="sr-only">{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default Toolbar;
