import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataValue } from "@/components/ui/DataValue";
import { HeatmapGrid } from "@/components/ui/HeatmapGrid";
import { BarChart3, Activity, Gauge, Shield, Clock } from "lucide-react";

const spreadData = [
  { label: "EURUSD", value: 92, sublabel: "0.2 pips" },
  { label: "BTCUSDT", value: 78, sublabel: "12 USD" },
  { label: "XAUUSD", value: 85, sublabel: "0.15" },
  { label: "ETHUSDT", value: 71, sublabel: "8 USD" },
  { label: "GBPUSD", value: 88, sublabel: "0.3 pips" },
  { label: "USDJPY", value: 90, sublabel: "0.2 pips" },
];

const activePairs = [
  { symbol: "EURUSD", spread: "0.2", frequency: "245/hr", pnl: 342.50 },
  { symbol: "BTCUSDT", spread: "12.5", frequency: "89/hr", pnl: 1245.00 },
  { symbol: "XAUUSD", spread: "0.15", frequency: "156/hr", pnl: 567.80 },
  { symbol: "ETHUSDT", spread: "8.2", frequency: "67/hr", pnl: 423.25 },
];

const tradeTape = [
  { time: "14:32:45", dir: "BUY", size: "0.10", spread: "0.2", pnl: 2.40 },
  { time: "14:32:44", dir: "SELL", size: "0.08", spread: "0.2", pnl: 1.80 },
  { time: "14:32:43", dir: "BUY", size: "0.15", spread: "0.1", pnl: 3.20 },
  { time: "14:32:42", dir: "SELL", size: "0.12", spread: "0.2", pnl: 2.10 },
  { time: "14:32:41", dir: "BUY", size: "0.10", spread: "0.3", pnl: 1.50 },
  { time: "14:32:40", dir: "SELL", size: "0.20", spread: "0.2", pnl: 4.80 },
];

export default function XyloStrategy() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-background" />
            </div>
            <div className="text-left">
              <h1 className="font-display text-4xl lg:text-5xl font-bold">Xylo</h1>
              <p className="text-muted-foreground">AI Market Maker</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Capturing edge from spreads and micro-structure.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard>
            <DataValue label="Daily Trades" value="1,247" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Win Rate" value="82%" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Avg Spread Cap." value="0.18" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Daily P&L" value="+$2,578" size="sm" change={3.2} />
          </GlassCard>
        </div>

        {/* Spread Heatmap */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl">Spread Heatmap</h3>
            <span className="text-xs text-muted-foreground ml-auto">Higher = Tighter spreads</span>
          </div>
          <HeatmapGrid cells={spreadData} columns={3} />
        </GlassCard>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Pairs */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Gauge className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">Active Pairs</h3>
            </div>
            <div className="space-y-3">
              {activePairs.map((pair) => (
                <div key={pair.symbol} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <span className="font-mono font-medium">{pair.symbol}</span>
                    <p className="text-xs text-muted-foreground mt-1">Spread: {pair.spread}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{pair.frequency}</p>
                    <p className="text-sm font-mono text-bullish">+${pair.pnl.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Trade Tape */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">Trade Tape</h3>
              <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full ml-auto animate-pulse">
                LIVE
              </span>
            </div>
            <div className="space-y-2 font-mono text-sm">
              <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground uppercase pb-2 border-b border-border">
                <span>Time</span>
                <span>Dir</span>
                <span>Size</span>
                <span>Spread</span>
                <span>P&L</span>
              </div>
              {tradeTape.map((trade, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground">{trade.time}</span>
                  <span className={trade.dir === "BUY" ? "text-bullish" : "text-bearish"}>
                    {trade.dir}
                  </span>
                  <span>{trade.size}</span>
                  <span className="text-muted-foreground">{trade.spread}</span>
                  <span className="text-bullish">+${trade.pnl.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Risk Controls */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl">Risk & Throttle Controls</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase mb-2">Max Inventory Per Symbol</p>
              <p className="font-mono font-bold text-lg">$50,000</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase mb-2">Max Simultaneous Markets</p>
              <p className="font-mono font-bold text-lg">6</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase mb-2">Circuit Breaker</p>
              <StatusBadge status="active" text="Normal" />
            </div>
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
}
