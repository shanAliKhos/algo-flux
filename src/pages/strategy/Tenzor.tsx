import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataValue } from "@/components/ui/DataValue";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TradeTable, Trade } from "@/components/ui/TradeTable";
import { MiniChart } from "@/components/ui/MiniChart";
import { Cpu, TrendingUp, Target, Activity, ArrowUpRight } from "lucide-react";

const trendScanner = [
  { instrument: "TSLA", score: 92, direction: "up", momentum: "Strong" },
  { instrument: "BTCUSDT", score: 87, direction: "up", momentum: "Strong" },
  { instrument: "NAS100", score: 78, direction: "up", momentum: "Moderate" },
  { instrument: "NVDA", score: 85, direction: "up", momentum: "Strong" },
  { instrument: "XAUUSD", score: 65, direction: "down", momentum: "Moderate" },
  { instrument: "EURUSD", score: 42, direction: "down", momentum: "Weak" },
];

const breakoutWatchlist = [
  { instrument: "AAPL", level: "195.00", distance: "2.8%", probability: 72 },
  { instrument: "MSFT", level: "420.00", distance: "1.5%", probability: 81 },
  { instrument: "BTCUSDT", level: "45000", distance: "3.2%", probability: 68 },
  { instrument: "AMZN", level: "185.00", distance: "2.1%", probability: 75 },
];

const openPositions = [
  { instrument: "TSLA", entry: 238.50, current: 245.30, trail: 240.00, pnl: 680 },
  { instrument: "BTCUSDT", entry: 42500, current: 43892, trail: 43000, pnl: 1392 },
  { instrument: "NAS100", entry: 17650, current: 17834, trail: 17750, pnl: 920 },
];

const trades: Trade[] = [
  { id: "1", time: "12:45", instrument: "TSLA", direction: "buy", entry: 238.50, size: "100", pnl: 680, rMultiple: 2.8 },
  { id: "2", time: "10:30", instrument: "NVDA", direction: "buy", entry: 485.20, exit: 502.80, size: "50", pnl: 880, rMultiple: 3.5 },
  { id: "3", time: "Yesterday", instrument: "NAS100", direction: "buy", entry: 17520, exit: 17780, size: "5", pnl: 1300, rMultiple: 2.2 },
  { id: "4", time: "Yesterday", instrument: "AAPL", direction: "buy", entry: 188.50, exit: 186.20, size: "75", pnl: -172.5, rMultiple: -0.8 },
];

export default function TenzorStrategy() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <Cpu className="w-8 h-8 text-background" />
            </div>
            <div className="text-left">
              <h1 className="font-display text-4xl lg:text-5xl font-bold">Tenzor</h1>
              <p className="text-muted-foreground">Momentum & Trend Engine</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Riding strong moves across stocks, indices, FX and crypto.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard>
            <DataValue label="Win Rate" value="76%" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Avg Winner" value="+2.8R" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Open Trades" value="3" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Unrealized P&L" value="+$2,992" size="sm" change={4.2} />
          </GlassCard>
        </div>

        {/* Trend Scanner */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl">Trend Strength Scanner</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendScanner.map((item) => (
              <div key={item.instrument} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-medium">{item.instrument}</span>
                  <div className={`flex items-center gap-1 ${
                    item.direction === "up" ? "text-bullish" : "text-bearish"
                  }`}>
                    <ArrowUpRight className={`w-4 h-4 ${item.direction === "down" ? "rotate-90" : ""}`} />
                    <span className="text-sm">{item.momentum}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        item.score > 70 ? "bg-bullish" : item.score > 50 ? "bg-neutral" : "bg-bearish"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="font-mono text-lg font-bold">{item.score}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Breakout Watchlist */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">Breakout Watchlist</h3>
            </div>
            <div className="space-y-3">
              {breakoutWatchlist.map((item) => (
                <div key={item.instrument} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <span className="font-mono font-medium">{item.instrument}</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Level: {item.level} ({item.distance} away)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Probability</p>
                    <p className="font-mono font-bold text-primary">{item.probability}%</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Position Map */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">Open Positions</h3>
            </div>
            <div className="space-y-3">
              {openPositions.map((pos) => (
                <div key={pos.instrument} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-medium">{pos.instrument}</span>
                    <span className="text-bullish font-mono">+${pos.pnl.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Entry</p>
                      <p className="font-mono">{pos.entry.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current</p>
                      <p className="font-mono text-bullish">{pos.current.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trail Stop</p>
                      <p className="font-mono text-neutral">{pos.trail.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <MiniChart height={32} color="bullish" />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Trade History */}
        <GlassCard>
          <h3 className="font-display font-bold text-xl mb-6">Trade History</h3>
          <TradeTable trades={trades} showStrategy={false} />
          <div className="mt-4 p-4 bg-muted/30 rounded-lg flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Focus: Large winners vs small losers</span>
            <span className="font-mono">Avg Win: +2.8R | Avg Loss: -0.8R</span>
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
}
