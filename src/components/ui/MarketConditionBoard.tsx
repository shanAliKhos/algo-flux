import { cn } from "@/lib/utils";
import { 
  Activity, TrendingUp, Zap, Droplets, Newspaper, Clock,
  Shield, Target, CheckCircle2, XCircle, AlertTriangle
} from "lucide-react";

interface MarketConditionBoardProps {
  className?: string;
}

export function MarketConditionBoard({ className }: MarketConditionBoardProps) {
  const marketPersonality = [
    { label: "Volatile", active: true, icon: Activity },
    { label: "Slow", active: false, icon: Clock },
    { label: "Ranging", active: false, icon: TrendingUp },
    { label: "Trending", active: true, icon: TrendingUp },
    { label: "Liquidity-heavy", active: true, icon: Droplets },
    { label: "News-driven", active: false, icon: Newspaper },
  ];

  const behaviorMap = [
    { asset: "Forex", behavior: "Risk-On", sentiment: 72 },
    { asset: "Crypto", behavior: "Bullish", sentiment: 85 },
    { asset: "Stocks", behavior: "Sector Rotation", sentiment: 58 },
    { asset: "Gold", behavior: "Safe-Haven Mild", sentiment: 45 },
    { asset: "Indices", behavior: "Volatility Spike", sentiment: 62 },
  ];

  const strategyAlignment = [
    { 
      asset: "Forex",
      strategies: [
        { name: "Nuvex", status: "active", opportunity: "high" },
        { name: "Drav", status: "active", opportunity: "medium" },
        { name: "Xylo", status: "disabled", opportunity: "low" },
      ]
    },
    { 
      asset: "Crypto",
      strategies: [
        { name: "Tenzor", status: "active", opportunity: "high" },
        { name: "Omnix", status: "active", opportunity: "high" },
        { name: "Yark", status: "active", opportunity: "medium" },
      ]
    },
    { 
      asset: "Stocks",
      strategies: [
        { name: "Yark", status: "active", opportunity: "high" },
        { name: "Omnix", status: "active", opportunity: "medium" },
        { name: "Tenzor", status: "disabled", opportunity: "low" },
      ]
    },
    { 
      asset: "Gold",
      strategies: [
        { name: "Drav", status: "active", opportunity: "high" },
        { name: "Nuvex", status: "active", opportunity: "medium" },
        { name: "Xylo", status: "disabled", opportunity: "low" },
      ]
    },
  ];

  return (
    <div className={cn("space-y-8", className)}>
      {/* Market Personality Today */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-xl font-bold mb-6">Market Personality Today</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {marketPersonality.map((item, i) => (
            <div 
              key={i}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all",
                item.active 
                  ? "bg-primary/10 border-primary/30" 
                  : "bg-muted/20 border-border/50"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                item.active ? "bg-primary/20" : "bg-muted"
              )}>
                <item.icon className={cn(
                  "w-6 h-6",
                  item.active ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <span className={cn(
                "text-sm font-medium",
                item.active ? "text-foreground" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
              {item.active && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Behavior Map */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-xl font-bold mb-6">Asset Behavior Map</h3>
        <div className="grid md:grid-cols-5 gap-4">
          {behaviorMap.map((item, i) => (
            <div 
              key={i}
              className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <div className="text-sm text-muted-foreground mb-2">{item.asset}</div>
              <div className="font-medium text-primary mb-3">{item.behavior}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      item.sentiment > 70 ? "bg-primary" :
                      item.sentiment > 50 ? "bg-warning" : "bg-destructive"
                    )}
                    style={{ width: `${item.sentiment}%` }}
                  />
                </div>
                <span className="text-xs font-mono">{item.sentiment}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Alignment */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-xl font-bold mb-6">Algo Strategy Alignment</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {strategyAlignment.map((asset, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Target className="w-4 h-4 text-primary" />
                <span className="font-medium">{asset.asset}</span>
              </div>
              <div className="space-y-2">
                {asset.strategies.map((strat, j) => (
                  <div 
                    key={j}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg",
                      strat.status === "active" ? "bg-card" : "bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {strat.status === "active" ? (
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                      ) : (
                        <XCircle className="w-3 h-3 text-muted-foreground" />
                      )}
                      <span className={cn(
                        "text-sm",
                        strat.status === "active" ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {strat.name}
                      </span>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded",
                      strat.opportunity === "high" ? "bg-primary/20 text-primary" :
                      strat.opportunity === "medium" ? "bg-warning/20 text-warning" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {strat.opportunity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
