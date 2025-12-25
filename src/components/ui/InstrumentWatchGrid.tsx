import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Activity } from "lucide-react";

interface InstrumentData {
  symbol: string;
  price: string;
  directionProbability: { up: number; down: number };
  trendStrength: number;
  activeStrategy: string;
  threats: string[];
}

interface InstrumentWatchGridProps {
  className?: string;
  instruments?: InstrumentData[];
}

export function InstrumentWatchGrid({ className, instruments: propInstruments }: InstrumentWatchGridProps) {
  if (!propInstruments || propInstruments.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <p>No instrument data available</p>
      </div>
    );
  }

  const instruments: InstrumentData[] = propInstruments;

  return (
    <div className={cn("grid gap-4", className)}>
      {/* Header */}
      <div className="hidden lg:grid grid-cols-6 gap-4 px-4 text-xs text-muted-foreground uppercase tracking-wider">
        <div>Symbol</div>
        <div>Price</div>
        <div>Direction Prob.</div>
        <div>Trend Strength</div>
        <div>Active Strategy</div>
        <div>Threats</div>
      </div>

      {/* Rows */}
      {instruments.map((item, i) => (
        <div 
          key={i}
          className="glass rounded-xl p-4 hover:border-primary/30 transition-all duration-300 group"
        >
          <div className="grid lg:grid-cols-6 gap-4 items-center">
            {/* Symbol */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-display font-bold">{item.symbol}</div>
                <div className="text-xs text-muted-foreground lg:hidden">
                  ${item.price}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="hidden lg:block font-mono text-lg">
              ${item.price}
            </div>

            {/* Direction Probability */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${item.directionProbability.up}%` }}
                />
                <div 
                  className="h-full bg-destructive"
                  style={{ width: `${item.directionProbability.down}%` }}
                />
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-primary flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {item.directionProbability.up}%
                </span>
                <span className="text-destructive flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  {item.directionProbability.down}%
                </span>
              </div>
            </div>

            {/* Trend Strength */}
            <div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-24">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      item.trendStrength > 70 ? "bg-primary" :
                      item.trendStrength > 40 ? "bg-warning" : "bg-muted-foreground"
                    )}
                    style={{ width: `${item.trendStrength}%` }}
                  />
                </div>
                <span className="text-sm font-mono">{item.trendStrength}</span>
              </div>
            </div>

            {/* Active Strategy */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                <Shield className="w-3 h-3" />
                {item.activeStrategy}
              </span>
            </div>

            {/* Threats */}
            <div className="flex flex-wrap gap-1.5">
              {item.threats.length === 0 ? (
                <span className="text-xs text-muted-foreground">No threats</span>
              ) : (
                item.threats.map((threat, j) => (
                  <span 
                    key={j}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-destructive/10 text-destructive text-xs"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {threat}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
