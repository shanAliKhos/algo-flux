import { cn } from "@/lib/utils";
import { 
  Clock, Zap, Star, Shield, TrendingDown, Activity,
  AlertTriangle, Target, CheckCircle2, FileText
} from "lucide-react";

interface TransparencyAuditProps {
  className?: string;
}

export function TransparencyAudit({ className }: TransparencyAuditProps) {
  const recentExecutions = [
    { time: "14:32:05", strategy: "Drav", symbol: "XAUUSD", direction: "Long", size: "0.85", price: "2,641.50", status: "Filled" },
    { time: "14:28:12", strategy: "Tenzor", symbol: "BTCUSDT", direction: "Long", size: "0.12", price: "98,245", status: "Filled" },
    { time: "14:15:48", strategy: "Nuvex", symbol: "EURUSD", direction: "Short", size: "1.20", price: "1.0892", status: "Filled" },
    { time: "13:58:22", strategy: "Omnix", symbol: "NAS100", direction: "Long", size: "0.50", price: "21,185", status: "Filled" },
    { time: "13:42:09", strategy: "Yark", symbol: "AAPL", direction: "Long", size: "25", price: "248.50", status: "Partial" },
  ];

  const performanceByStrategy = [
    { name: "Drav", winRate: 72.5, avgR: 2.1, trades: 156, pnl: "+$45,230" },
    { name: "Tenzor", winRate: 68.2, avgR: 2.8, trades: 142, pnl: "+$52,180" },
    { name: "Nuvex", winRate: 65.8, avgR: 1.9, trades: 198, pnl: "+$38,450" },
    { name: "Omnix", winRate: 71.1, avgR: 2.3, trades: 89, pnl: "+$28,920" },
    { name: "Yark", winRate: 62.4, avgR: 1.7, trades: 124, pnl: "+$22,340" },
    { name: "Xylo", winRate: 58.9, avgR: 1.2, trades: 312, pnl: "+$18,650" },
  ];

  const riskMetrics = [
    { label: "Max Leverage Allowed", value: "1:50", status: "ok" },
    { label: "Current Leverage", value: "1:12", status: "ok" },
    { label: "Max Drawdown (Observed)", value: "-8.4%", status: "warning" },
    { label: "Current Drawdown", value: "-2.1%", status: "ok" },
    { label: "Avg Slippage", value: "0.02 pips", status: "ok" },
    { label: "Fill Rate", value: "99.8%", status: "ok" },
  ];

  const anomalies = [
    { time: "12:45:00", type: "Volatility Spike", asset: "XAUUSD", severity: "medium" },
    { time: "10:30:00", type: "Liquidity Drop", asset: "ETH", severity: "low" },
    { time: "09:15:00", type: "Spread Widening", asset: "EURUSD", severity: "low" },
  ];

  const dailyAccuracy = [
    { day: "Mon", accuracy: 78 },
    { day: "Tue", accuracy: 72 },
    { day: "Wed", accuracy: 85 },
    { day: "Thu", accuracy: 68 },
    { day: "Fri", accuracy: 82 },
    { day: "Sat", accuracy: 75 },
    { day: "Sun", accuracy: 79 },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Real-Time Trade Log */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold">Real-Time Trade Log</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3">Time</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3">Strategy</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3">Symbol</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3">Direction</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3">Size</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3">Price</th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentExecutions.map((exec, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/10">
                  <td className="py-3 font-mono text-sm">{exec.time}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">{exec.strategy}</span>
                  </td>
                  <td className="py-3 font-medium">{exec.symbol}</td>
                  <td className="py-3">
                    <span className={cn(
                      "text-xs",
                      exec.direction === "Long" ? "text-primary" : "text-destructive"
                    )}>{exec.direction}</span>
                  </td>
                  <td className="py-3 font-mono text-sm">{exec.size}</td>
                  <td className="py-3 font-mono text-sm">{exec.price}</td>
                  <td className="py-3">
                    <span className={cn(
                      "flex items-center gap-1 text-xs",
                      exec.status === "Filled" ? "text-primary" : "text-warning"
                    )}>
                      {exec.status === "Filled" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {exec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance by Strategy */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-xl font-bold mb-4">Performance by Strategy</h3>
          <div className="space-y-3">
            {performanceByStrategy.map((strat, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-3">
                  <span className="w-16 font-medium">{strat.name}</span>
                  <span className="text-xs text-muted-foreground">{strat.trades} trades</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                    <div className="text-sm text-primary font-mono">{strat.winRate}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Avg R</div>
                    <div className="text-sm text-primary font-mono">{strat.avgR}R</div>
                  </div>
                  <div className="text-right w-20">
                    <div className="text-sm font-bold text-primary">{strat.pnl}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk & Compliance */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-xl font-bold mb-4">Risk & Compliance</h3>
          <div className="grid grid-cols-2 gap-3">
            {riskMetrics.map((metric, i) => (
              <div key={i} className="p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  {metric.status === "ok" ? (
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-warning" />
                  )}
                </div>
                <div className={cn(
                  "font-mono font-bold",
                  metric.status === "ok" ? "text-foreground" : "text-warning"
                )}>
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Market Anomalies */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-xl font-bold mb-4">Market Anomalies Detected</h3>
          <div className="space-y-3">
            {anomalies.map((anomaly, i) => (
              <div 
                key={i}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  anomaly.severity === "high" ? "bg-destructive/10 border-destructive/30" :
                  anomaly.severity === "medium" ? "bg-warning/10 border-warning/30" :
                  "bg-muted/20 border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className={cn(
                    "w-4 h-4",
                    anomaly.severity === "high" ? "text-destructive" :
                    anomaly.severity === "medium" ? "text-warning" : "text-muted-foreground"
                  )} />
                  <div>
                    <div className="text-sm font-medium">{anomaly.type}</div>
                    <div className="text-xs text-muted-foreground">{anomaly.asset}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{anomaly.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Accuracy */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-xl font-bold mb-4">Daily Accuracy Tracker</h3>
          <div className="flex items-end justify-between h-32 gap-2">
            {dailyAccuracy.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full rounded-t bg-primary/60 transition-all hover:bg-primary"
                  style={{ height: `${day.accuracy}%` }}
                />
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">Weekly Avg</span>
            <span className="text-sm font-bold text-primary">77.0%</span>
          </div>
        </div>
      </div>

      {/* Compliance Logs */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold">Compliance Logs</h3>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm">
            <FileText className="w-4 h-4" />
            Export Report
          </button>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-xs text-muted-foreground">Risk Compliance</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-xs text-muted-foreground">Policy Violations</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <div className="text-2xl font-bold text-primary">99.9%</div>
            <div className="text-xs text-muted-foreground">System Uptime</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <div className="text-2xl font-bold text-primary">12ms</div>
            <div className="text-xs text-muted-foreground">Avg Latency</div>
          </div>
        </div>
      </div>
    </div>
  );
}
