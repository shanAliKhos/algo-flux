import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataValue } from "@/components/ui/DataValue";
import { MiniChart } from "@/components/ui/MiniChart";
import { TradeTable, Trade } from "@/components/ui/TradeTable";
import { LineChart, Activity, TrendingUp, BarChart, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";

interface Strategy {
  name: string;
  status: 'active' | 'waiting' | 'cooling';
  accuracy: number;
  confidence: 'high' | 'medium' | 'low';
  bias: string;
  instruments: string[];
  tagline?: string;
  correlationMatrix?: Array<{ pair: string; correlation: number; strength: string }>;
  volatilityData?: Array<{ asset: string; h1: number; h4: number; d1: number }>;
  winRate?: number;
  sharpeRatio?: number;
  pairsTracked?: number;
  activeTrades?: number;
}

const defaultCorrelationMatrix = [
  { pair: "EURUSD / GBPUSD", correlation: 0.85, strength: "Strong+" },
  { pair: "NAS100 / SPX500", correlation: 0.92, strength: "Strong+" },
];

const defaultVolatilityData = [
  { asset: "XAUUSD", h1: 68, h4: 72, d1: 58 },
  { asset: "BTCUSD", h1: 85, h4: 78, d1: 82 },
];

const defaultTrades: Trade[] = [
  { id: "1", time: "11:30", instrument: "EUR/GBP Spread", direction: "buy", entry: 0.8542, size: "1.00", pnl: 345, rMultiple: 1.8 },
  { id: "2", time: "09:15", instrument: "Gold/Yen Pair", direction: "sell", entry: 150.25, size: "0.50", pnl: 520, rMultiple: 2.4 },
];

export default function YarkStrategy() {
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

  const strategy = strategies.find(s => s.name.toLowerCase() === 'yark') || {
    name: 'Yark',
    status: 'active' as const,
    accuracy: 85,
    confidence: 'high' as const,
    bias: 'Statistical Edge',
    instruments: ['EURUSD', 'GBPJPY', 'AUDUSD', 'BTCUSDT'],
    tagline: 'Quantitative Statistical Engine',
    winRate: 85,
    sharpeRatio: 2.4,
    pairsTracked: 48,
    activeTrades: 6,
  };

  const correlationMatrix = strategy.correlationMatrix || defaultCorrelationMatrix;
  const volatilityData = strategy.volatilityData || defaultVolatilityData;
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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <LineChart className="w-8 h-8 text-background" />
            </div>
            <div className="text-left">
              <h1 className="font-display text-4xl lg:text-5xl font-bold">{strategy.name}</h1>
              <p className="text-muted-foreground">{strategy.tagline || 'Quantitative Statistical Engine'}</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Correlation, volatility and probability in one place.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard>
            <DataValue label="Win Rate" value={`${strategy.winRate || strategy.accuracy}%`} size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Sharpe Ratio" value={strategy.sharpeRatio?.toFixed(1) || "2.4"} size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Pairs Tracked" value={strategy.pairsTracked?.toString() || "48"} size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Active Trades" value={strategy.activeTrades?.toString() || "6"} size="sm" />
          </GlassCard>
        </div>

        {/* Correlation Grid */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl">Correlation Grid</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {correlationMatrix.map((item, i) => (
              <div key={i} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm">{item.pair}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.correlation > 0.7 ? "bg-bullish/20 text-bullish" :
                    item.correlation < -0.5 ? "bg-bearish/20 text-bearish" :
                    "bg-neutral/20 text-neutral"
                  }`}>
                    {item.strength}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        item.correlation > 0 ? "bg-bullish" : "bg-bearish"
                      }`}
                      style={{ width: `${Math.abs(item.correlation) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm w-12">{item.correlation.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Volatility Matrix */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <BarChart className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl">Volatility Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Asset</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">H1</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">H4</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">D1</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Trend</th>
                </tr>
              </thead>
              <tbody>
                {volatilityData.map((item) => (
                  <tr key={item.asset} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-4 px-2 font-mono font-medium">{item.asset}</td>
                    <td className="py-4 px-2">
                      <span className={item.h1 > 70 ? "text-bearish" : item.h1 > 50 ? "text-neutral" : "text-bullish"}>
                        {item.h1}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className={item.h4 > 70 ? "text-bearish" : item.h4 > 50 ? "text-neutral" : "text-bullish"}>
                        {item.h4}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className={item.d1 > 70 ? "text-bearish" : item.d1 > 50 ? "text-neutral" : "text-bullish"}>
                        {item.d1}
                      </span>
                    </td>
                    <td className="py-4 px-2 w-24">
                      <MiniChart height={24} color="primary" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Expected Return Curves */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl">Expected Return Curves</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">EURUSD - Current Regime</p>
              <MiniChart height={100} color="primary" />
              <p className="text-xs text-muted-foreground mt-2">Expected: +0.8% over 5 days</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">Gold/Yen - Current Regime</p>
              <MiniChart height={100} color="bullish" />
              <p className="text-xs text-muted-foreground mt-2">Expected: +1.2% over 5 days</p>
            </div>
          </div>
        </GlassCard>

        {/* Trade History */}
        <GlassCard>
          <h3 className="font-display font-bold text-xl mb-6">Recent Trades</h3>
          <TradeTable trades={trades} showStrategy={false} />
        </GlassCard>
      </div>
    </Layout>
  );
}
