import { Button } from "@/app/components/ui/button";
import { AlertCircle } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface WarningAction {
  label: string;
  onClick: () => void;
  variant?: "destructive" | "ghost" | "default";
  className?: string;
}

interface WarningAlertProps {
  message: string;
  actions: WarningAction[];
  variant?: "warning" | "danger";
  className?: string;
}

const WarningAlert = ({
  message,
  actions,
  variant = "warning",
  className,
}: WarningAlertProps) => {
  const isWarning = variant === "warning";
  const bgColor = isWarning ? "bg-amber-50" : "bg-red-50";
  const borderColor = isWarning ? "border-amber-200" : "border-red-200";
  const textColor = isWarning ? "text-amber-800" : "text-red-800";
  const hoverBgColor = isWarning ? "hover:bg-amber-100" : "hover:bg-red-100";

  return (
    <div
      className={cn(
        "flex flex-col p-3 text-sm border rounded-md",
        bgColor,
        borderColor,
        className
      )}
    >
      <div className="flex items-center gap-2">
        {!isWarning && (
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
        )}
        <div className={cn("flex-1", textColor)}>{message}</div>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "ghost"}
            size="sm"
            className={cn(
              "text-xs",
              action.variant === "destructive" &&
                "text-red-600 hover:text-red-700",
              action.variant !== "destructive" && hoverBgColor,
              action.className
            )}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WarningAlert;
