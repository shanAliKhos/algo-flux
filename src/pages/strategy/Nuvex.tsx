import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TradeTable, Trade } from "@/components/ui/TradeTable";
import { MiniChart } from "@/components/ui/MiniChart";
import { DataValue } from "@/components/ui/DataValue";
import { Target, Shield, Activity, TrendingDown, Clock, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";

interface Strategy {
  name: string;
  status: 'active' | 'waiting' | 'cooling';
  accuracy: number;
  confidence: 'high' | 'medium' | 'low';
  bias: string;
  instruments: string[];
  tagline?: string;
  instrumentGrid?: Array<{ symbol: string; price: string; trend: string; probability: number; status: string }>;
  patterns?: Array<{ instrument: string; timeframe: string; type: string; strength: number }>;
  winRate?: number;
  avgRR?: number;
  maxDD?: number;
  activeTrades?: number;
  maxTradesPerDay?: number;
  maxCorrelatedExposure?: number;
  dailyLossLimit?: number;
}

const defaultInstruments = [
  { symbol: "XAUUSD", price: "2,034.50", trend: "Overextended", probability: 78, status: "watching" },
  { symbol: "EURUSD", price: "1.0892", trend: "Balanced", probability: 45, status: "active" },
];

const defaultPatterns = [
  { instrument: "XAUUSD", timeframe: "H4", type: "Bearish Engulfing", strength: 85 },
  { instrument: "EURUSD", timeframe: "H1", type: "Bullish Engulfing", strength: 72 },
];

const defaultTrades: Trade[] = [
  { id: "1", time: "14:32", instrument: "XAUUSD", direction: "sell", entry: 2040.50, exit: 2028.00, size: "0.50", pnl: 625, rMultiple: 2.5 },
  { id: "2", time: "11:15", instrument: "EURUSD", direction: "buy", entry: 1.0845, exit: 1.0892, size: "1.00", pnl: 470, rMultiple: 1.8 },
];

export default function NuvexStrategy() {
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

  const strategy = strategies.find(s => s.name.toLowerCase() === 'nuvex') || {
    name: 'Nuvex',
    status: 'active' as const,
    accuracy: 78,
    confidence: 'high' as const,
    bias: 'Bullish Reversal',
    instruments: ['XAUUSD', 'EURUSD', 'GBPUSD', 'NAS100'],
    tagline: 'Institutional Reversal Engine',
    winRate: 78,
    avgRR: 2.1,
    maxDD: -4.2,
    activeTrades: 3,
    maxTradesPerDay: 8,
    maxCorrelatedExposure: 40,
    dailyLossLimit: 5,
  };

  const instruments = strategy.instrumentGrid || defaultInstruments;
  const patterns = strategy.patterns || defaultPatterns;
  const trades = defaultTrades;

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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Target className="w-8 h-8 text-background" />
            </div>
            <div className="text-left">
              <h1 className="font-display text-4xl lg:text-5xl font-bold">{strategy.name}</h1>
              <p className="text-muted-foreground">{strategy.tagline || 'Institutional Reversal Engine'}</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            How Nuvex hunts high-probability reversals in FX, gold, indices and stocks.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard>
            <DataValue label="Win Rate" value={`${strategy.winRate || strategy.accuracy}%`} size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Avg R:R" value={strategy.avgRR?.toFixed(1) || "2.1"} size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Max DD" value={`${strategy.maxDD?.toFixed(1) || "-4.2"}%`} size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Active Trades" value={strategy.activeTrades?.toString() || "3"} size="sm" />
          </GlassCard>
        </div>

        {/* Instrument Grid */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl">Instrument Grid</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Symbol</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Price</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Trend State</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Reversal Prob.</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {instruments.map((inst) => (
                  <tr key={inst.symbol} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-4 px-2 font-mono font-medium">{inst.symbol}</td>
                    <td className="py-4 px-2 font-mono text-muted-foreground">{inst.price}</td>
                    <td className="py-4 px-2">
                      <span className={
                        inst.trend === "Overextended" || inst.trend === "Overbought"
                          ? "text-bearish"
                          : inst.trend === "Oversold"
                          ? "text-bullish"
                          : "text-muted-foreground"
                      }>
                        {inst.trend}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${inst.probability}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono">{inst.probability}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <StatusBadge status={inst.status as any} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pattern Scanner */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <TrendingDown className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">Pattern Scanner</h3>
            </div>
            <div className="space-y-3">
              {patterns.map((pattern, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{pattern.instrument}</span>
                    <span className="text-xs text-muted-foreground">{pattern.timeframe}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{pattern.type}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${pattern.strength}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{pattern.strength}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Risk Controls */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">Risk Controls</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <span className="text-sm">Max Trades Per Day</span>
                <span className="font-mono font-bold">{strategy.maxTradesPerDay || 8}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <span className="text-sm">Max Correlated Exposure</span>
                <span className="font-mono font-bold">{strategy.maxCorrelatedExposure || 40}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <span className="text-sm">Daily Loss Limit</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-bullish rounded-full" style={{ width: "25%" }} />
                  </div>
                  <span className="font-mono text-sm">1.2% / {strategy.dailyLossLimit || 5}%</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Trade History */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl">Trade History</h3>
          </div>
          <TradeTable trades={trades} showStrategy={false} />
        </GlassCard>
      </div>
    </Layout>
  );
}
