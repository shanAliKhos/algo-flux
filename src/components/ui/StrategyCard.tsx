import { GlassCard } from "./GlassCard";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StrategyCardProps {
  name: string;
  icon: LucideIcon;
  status: "active" | "waiting" | "cooling";
  accuracy: number;
  confidence: "low" | "medium" | "high";
  bias: string;
  instruments: string[];
  path: string;
}

export function StrategyCard({
  name,
  icon: Icon,
  status,
  accuracy,
  confidence,
  bias,
  instruments,
  path,
}: StrategyCardProps) {
  return (
    <GlassCard hover className="group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">{name}</h3>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Accuracy</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <span className="text-sm font-mono font-medium">{accuracy}%</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Confidence</p>
          <StatusBadge risk={confidence} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Market Bias</p>
        <p className="text-sm font-medium">{bias}</p>
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Active Instruments</p>
        <div className="flex flex-wrap gap-1.5">
          {instruments.slice(0, 4).map((inst) => (
            <span
              key={inst}
              className="px-2 py-0.5 text-xs font-mono bg-muted rounded border border-border"
            >
              {inst}
            </span>
          ))}
          {instruments.length > 4 && (
            <span className="px-2 py-0.5 text-xs text-muted-foreground">
              +{instruments.length - 4}
            </span>
          )}
        </div>
      </div>

      <Link
        to={path}
        className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all"
      >
        View Strategy Room
        <ArrowRight className="w-4 h-4" />
      </Link>
    </GlassCard>
  );
}
