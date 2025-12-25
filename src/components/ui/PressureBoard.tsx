import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Activity, Droplets, GitBranch, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PressureItem {
  label: string;
  value: number; // 0-100
  status: "low" | "medium" | "high" | "extreme";
  icon: LucideIcon;
}

interface PressureBoardProps {
  className?: string;
  pressureItems?: Array<{
    label: string;
    value: number;
    trend: 'up' | 'down' | 'neutral';
  }>;
}

export function PressureBoard({ className, pressureItems }: PressureBoardProps) {
  // Map backend data to component format
  const mapTrendToStatus = (trend: 'up' | 'down' | 'neutral', value: number): "low" | "medium" | "high" | "extreme" => {
    if (value >= 80) return "extreme";
    if (value >= 60) return "high";
    if (value >= 40) return "medium";
    return "low";
  };

  const mapTrendToIcon = (trend: 'up' | 'down' | 'neutral'): LucideIcon => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return Activity;
  };

  if (!pressureItems || pressureItems.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <p>No pressure data available</p>
      </div>
    );
  }

  const pressures: PressureItem[] = pressureItems.map((item) => ({
    label: item.label,
    value: item.value,
    status: mapTrendToStatus(item.trend, item.value),
    icon: mapTrendToIcon(item.trend),
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low": return "bg-muted text-muted-foreground";
      case "medium": return "bg-warning/20 text-warning";
      case "high": return "bg-primary/20 text-primary";
      case "extreme": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getBarColor = (status: string) => {
    switch (status) {
      case "low": return "bg-muted-foreground";
      case "medium": return "bg-warning";
      case "high": return "bg-primary";
      case "extreme": return "bg-destructive";
      default: return "bg-muted-foreground";
    }
  };

  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {pressures.map((item, i) => (
        <div 
          key={i}
          className="glass rounded-xl p-4 hover:border-primary/30 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
              getStatusColor(item.status),
              "group-hover:scale-110"
            )}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{item.label}</div>
              <div className={cn(
                "text-xs capitalize",
                item.status === "extreme" ? "text-destructive" : 
                item.status === "high" ? "text-primary" :
                item.status === "medium" ? "text-warning" : "text-muted-foreground"
              )}>
                {item.status}
              </div>
            </div>
          </div>
          
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-700", getBarColor(item.status))}
              style={{ width: `${item.value}%` }}
            />
            {/* Animated pulse overlay for high/extreme */}
            {(item.status === "high" || item.status === "extreme") && (
              <div 
                className={cn(
                  "absolute inset-0 rounded-full animate-pulse opacity-50",
                  getBarColor(item.status)
                )}
                style={{ width: `${item.value}%` }}
              />
            )}
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0</span>
            <span className="font-bold text-foreground">{item.value}</span>
            <span>100</span>
          </div>
        </div>
      ))}
    </div>
  );
}
