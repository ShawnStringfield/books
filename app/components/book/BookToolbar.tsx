import { Settings2, Plus, Pencil, Trash2 } from "lucide-react";
import Toolbar, { ToolbarAction } from "@/app/components/dashboard/Toolbar";

interface BookToolbarProps {
  onReadingControlsClick: () => void;
  onHighlightClick: () => void;
  onEditClick?: () => void;
  onDeleteClick: () => void;
  showReadingControls?: boolean;
  showHighlights?: boolean;
  className?: string;
  variant?: "sheet" | "page";
}

export default function BookToolbar({
  onReadingControlsClick,
  onHighlightClick,
  onEditClick,
  onDeleteClick,
  showReadingControls = false,
  showHighlights = false,
  className,
  variant = "page",
}: BookToolbarProps) {
  const actions: ToolbarAction[] = [
    {
      icon: Settings2,
      label: "Reading controls",
      onClick: onReadingControlsClick,
      variant: showReadingControls ? "outline" : "default",
    },
    {
      icon: Plus,
      label: "Add highlight",
      onClick: onHighlightClick,
      variant: showHighlights ? "outline" : "default",
    },
  ];

  // Only show edit button in page variant
  if (variant === "page" && onEditClick) {
    actions.push({
      icon: Pencil,
      label: "Toggle edit mode",
      onClick: onEditClick,
    });
  }

  // Always show delete button last
  actions.push({
    icon: Trash2,
    label: "Delete book",
    onClick: onDeleteClick,
    variant: "destructive",
  });

  return <Toolbar actions={actions} className={className} />;
}
