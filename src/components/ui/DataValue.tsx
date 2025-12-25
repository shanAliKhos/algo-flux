import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DataValueProps {
  label: string;
  value: string | number;
  change?: number;
  unit?: string;
  size?: "sm" | "md" | "lg";
}

export function DataValue({ label, value, change, unit, size = "md" }: DataValueProps) {
  const sizeClasses = {
    sm: { label: "text-xs", value: "text-lg" },
    md: { label: "text-xs", value: "text-2xl" },
    lg: { label: "text-sm", value: "text-4xl" },
  };

  return (
    <div className="space-y-1">
      <p className={cn("text-muted-foreground uppercase tracking-wider", sizeClasses[size].label)}>
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className={cn("font-display font-bold", sizeClasses[size].value)}>
          {value}
          {unit && <span className="text-muted-foreground text-sm ml-1">{unit}</span>}
        </span>
        {change !== undefined && (
          <span
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              change > 0 ? "text-bullish" : change < 0 ? "text-bearish" : "text-muted-foreground"
            )}
          >
            {change > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : change < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            {Math.abs(change).toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  );
}
