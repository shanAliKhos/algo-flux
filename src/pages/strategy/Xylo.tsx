import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataValue } from "@/components/ui/DataValue";
import { HeatmapGrid } from "@/components/ui/HeatmapGrid";
import { BarChart3, Activity, Gauge, Shield, Clock, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";

interface Strategy {
  name: string;
  status: 'active' | 'waiting' | 'cooling';
  accuracy: number;
  confidence: 'high' | 'medium' | 'low';
  bias: string;
  instruments: string[];
  tagline?: string;
  spreadData?: Array<{ label: string; value: number; sublabel: string }>;
  activePairs?: Array<{ symbol: string; spread: string; frequency: string; pnl: number }>;
  tradeTape?: Array<{ time: string; dir: string; size: string; spread: string; pnl: number }>;
  dailyTrades?: number;
  winRate?: number;
  avgSpreadCap?: number;
  dailyPnl?: number;
  maxInventoryPerSymbol?: number;
  maxSimultaneousMarkets?: number;
}

const defaultSpreadData = [
  { label: "EURUSD", value: 92, sublabel: "0.2 pips" },
  { label: "BTCUSDT", value: 78, sublabel: "12 USD" },
];

const defaultActivePairs = [
  { symbol: "EURUSD", spread: "0.2", frequency: "245/hr", pnl: 342.50 },
  { symbol: "BTCUSDT", spread: "12.5", frequency: "89/hr", pnl: 1245.00 },
];

const defaultTradeTape = [
  { time: "14:32:45", dir: "BUY", size: "0.10", spread: "0.2", pnl: 2.40 },
  { time: "14:32:44", dir: "SELL", size: "0.08", spread: "0.2", pnl: 1.80 },
];

export default function XyloStrategy() {
  const { data: strategies = [], isLoading } = useQuery<Strategy[]>({
    queryKey: ['strategies'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<Strategy[]>('/strategies', true);
        return response || [];
      } catch (error) {
        console.error('Failed to fetch strategies:', error);
        return [];
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const strategy = strategies.find(s => s.name.toLowerCase() === 'xylo') || {
    name: 'Xylo',
    status: 'active' as const,
    accuracy: 82,
    confidence: 'medium' as const,
    bias: 'Range / Mean-Revert',
    instruments: ['BTCUSDT', 'ETHUSDT', 'EURUSD'],
    tagline: 'AI Market Maker',
    dailyTrades: 1247,
    winRate: 82,
    avgSpreadCap: 0.18,
    dailyPnl: 2578,
    maxInventoryPerSymbol: 50000,
    maxSimultaneousMarkets: 6,
  };

  const spreadData = strategy.spreadData || defaultSpreadData;
  const activePairs = strategy.activePairs || defaultActivePairs;
  const tradeTape = strategy.tradeTape || defaultTradeTape;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
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
              <h1 className="font-display text-4xl lg:text-5xl font-bold">{strategy.name}</h1>
              <p className="text-muted-foreground">{strategy.tagline || 'AI Market Maker'}</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Capturing edge from spreads and micro-structure.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard>
            <DataValue label="Daily Trades" value={strategy.dailyTrades?.toLocaleString() || "1,247"} size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Win Rate" value={`${strategy.winRate || strategy.accuracy}%`} size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Avg Spread Cap." value={strategy.avgSpreadCap?.toFixed(2) || "0.18"} size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Daily P&L" value={`+$${strategy.dailyPnl?.toLocaleString() || "2,578"}`} size="sm" change={3.2} />
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
              <p className="font-mono font-bold text-lg">${strategy.maxInventoryPerSymbol?.toLocaleString() || "50,000"}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase mb-2">Max Simultaneous Markets</p>
              <p className="font-mono font-bold text-lg">{strategy.maxSimultaneousMarkets || 6}</p>
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
