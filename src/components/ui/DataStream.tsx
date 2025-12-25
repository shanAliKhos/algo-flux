import { cn } from "@/lib/utils";

interface DataStreamProps {
  label: string;
  active?: boolean;
  delay?: number;
}

export function DataStream({ label, active = true, delay = 0 }: DataStreamProps) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="relative flex-1 h-1 bg-muted rounded-full overflow-hidden">
        {active && (
          <div
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent animate-data-flow"
            style={{ animationDelay: `${delay}ms` }}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            active ? "bg-primary animate-pulse" : "bg-muted-foreground"
          )}
        />
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
      </div>
    </div>
  );
}
