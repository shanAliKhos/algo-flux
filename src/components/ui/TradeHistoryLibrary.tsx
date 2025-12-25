import { cn } from "@/lib/utils";
import { 
  Filter, Search, TrendingUp, TrendingDown, Clock, 
  Star, PlayCircle, BarChart3, Activity, Calendar
} from "lucide-react";
import { useState } from "react";

interface TradeHistoryLibraryProps {
  className?: string;
}

interface Trade {
  id: string;
  symbol: string;
  strategy: string;
  type: "scalp" | "day" | "swing";
  direction: "long" | "short";
  entry: string;
  exit: string;
  pnl: number;
  pnlPercent: number;
  rMultiple: number;
  duration: string;
  quality: "A" | "B" | "C" | "D";
  date: string;
}

export function TradeHistoryLibrary({ className }: TradeHistoryLibraryProps) {
  const [selectedStrategy, setSelectedStrategy] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const trades: Trade[] = [
    { id: "1", symbol: "XAUUSD", strategy: "Drav", type: "day", direction: "long", entry: "2,635.00", exit: "2,652.50", pnl: 1750, pnlPercent: 2.8, rMultiple: 2.5, duration: "3h 24m", quality: "A", date: "2024-01-15" },
    { id: "2", symbol: "BTCUSDT", strategy: "Tenzor", type: "swing", direction: "long", entry: "95,200", exit: "98,850", pnl: 3650, pnlPercent: 3.8, rMultiple: 3.2, duration: "18h 45m", quality: "A", date: "2024-01-14" },
    { id: "3", symbol: "EURUSD", strategy: "Nuvex", type: "scalp", direction: "short", entry: "1.0925", exit: "1.0898", pnl: 540, pnlPercent: 1.2, rMultiple: 1.8, duration: "45m", quality: "B", date: "2024-01-14" },
    { id: "4", symbol: "NAS100", strategy: "Omnix", type: "day", direction: "long", entry: "21,100", exit: "21,285", pnl: 1850, pnlPercent: 2.2, rMultiple: 2.1, duration: "5h 12m", quality: "A", date: "2024-01-13" },
    { id: "5", symbol: "TSLA", strategy: "Yark", type: "swing", direction: "short", entry: "425.00", exit: "398.50", pnl: -850, pnlPercent: -1.4, rMultiple: -1.0, duration: "2d 4h", quality: "C", date: "2024-01-12" },
    { id: "6", symbol: "ETH", strategy: "Xylo", type: "scalp", direction: "long", entry: "3,820", exit: "3,865", pnl: 450, pnlPercent: 1.1, rMultiple: 1.5, duration: "28m", quality: "B", date: "2024-01-12" },
    { id: "7", symbol: "GBPUSD", strategy: "Nuvex", type: "day", direction: "long", entry: "1.2680", exit: "1.2645", pnl: -420, pnlPercent: -0.8, rMultiple: -0.7, duration: "2h 55m", quality: "D", date: "2024-01-11" },
    { id: "8", symbol: "XAUUSD", strategy: "Drav", type: "day", direction: "short", entry: "2,658.00", exit: "2,642.00", pnl: 1600, pnlPercent: 2.4, rMultiple: 2.3, duration: "4h 18m", quality: "A", date: "2024-01-10" },
  ];

  const strategies = ["all", "Nuvex", "Xylo", "Drav", "Yark", "Tenzor", "Omnix"];
  const types = ["all", "scalp", "day", "swing"];

  const filteredTrades = trades.filter(t => 
    (selectedStrategy === "all" || t.strategy === selectedStrategy) &&
    (selectedType === "all" || t.type === selectedType)
  );

  const winRate = (filteredTrades.filter(t => t.pnl > 0).length / filteredTrades.length * 100).toFixed(1);
  const avgR = (filteredTrades.reduce((acc, t) => acc + t.rMultiple, 0) / filteredTrades.length).toFixed(2);
  const totalPnl = filteredTrades.reduce((acc, t) => acc + t.pnl, 0);

  // Streak calculation
  const winStreak = trades.filter(t => t.pnl > 0).length;
  const loseStreak = trades.filter(t => t.pnl < 0).length;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filters */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {strategies.map(s => (
              <button
                key={s}
                onClick={() => setSelectedStrategy(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  selectedStrategy === s 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {s === "all" ? "All Strategies" : s}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-border hidden sm:block" />

          <div className="flex gap-2">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
                  selectedType === t 
                    ? "bg-warning text-warning-foreground" 
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {t === "all" ? "All Types" : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Win Rate</div>
          <div className="text-xl font-bold text-primary">{winRate}%</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Avg R</div>
          <div className="text-xl font-bold text-primary">{avgR}R</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Total P/L</div>
          <div className={cn("text-xl font-bold", totalPnl >= 0 ? "text-primary" : "text-destructive")}>
            {totalPnl >= 0 ? "+" : ""}{totalPnl.toLocaleString()}
          </div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Win Streak</div>
          <div className="text-xl font-bold text-primary">{winStreak}</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Lose Streak</div>
          <div className="text-xl font-bold text-destructive">{loseStreak}</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Total Trades</div>
          <div className="text-xl font-bold">{filteredTrades.length}</div>
        </div>
      </div>

      {/* Trade Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider p-4">Symbol</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider p-4">Strategy</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider p-4">Type</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider p-4">Direction</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider p-4">Entry/Exit</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider p-4">P/L</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider p-4">R Multiple</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider p-4">Duration</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider p-4">Quality</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider p-4">Replay</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade, i) => (
                <tr 
                  key={trade.id}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="font-mono font-medium">{trade.symbol}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">
                      {trade.strategy}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs capitalize text-muted-foreground">{trade.type}</span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "flex items-center gap-1 text-xs",
                      trade.direction === "long" ? "text-primary" : "text-destructive"
                    )}>
                      {trade.direction === "long" 
                        ? <TrendingUp className="w-3 h-3" /> 
                        : <TrendingDown className="w-3 h-3" />}
                      {trade.direction.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-mono">
                      <span className="text-muted-foreground">In:</span> {trade.entry}
                      <br />
                      <span className="text-muted-foreground">Out:</span> {trade.exit}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={cn(
                      "font-mono font-bold",
                      trade.pnl >= 0 ? "text-primary" : "text-destructive"
                    )}>
                      {trade.pnl >= 0 ? "+" : ""}{trade.pnl.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {trade.pnlPercent >= 0 ? "+" : ""}{trade.pnlPercent}%
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "font-mono font-bold",
                      trade.rMultiple >= 0 ? "text-primary" : "text-destructive"
                    )}>
                      {trade.rMultiple >= 0 ? "+" : ""}{trade.rMultiple}R
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {trade.duration}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "w-6 h-6 rounded flex items-center justify-center text-xs font-bold",
                      trade.quality === "A" ? "bg-primary/20 text-primary" :
                      trade.quality === "B" ? "bg-warning/20 text-warning" :
                      trade.quality === "C" ? "bg-muted text-muted-foreground" :
                      "bg-destructive/20 text-destructive"
                    )}>
                      {trade.quality}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                      <PlayCircle className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
