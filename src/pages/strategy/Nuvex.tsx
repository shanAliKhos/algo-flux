import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TradeTable, Trade } from "@/components/ui/TradeTable";
import { MiniChart } from "@/components/ui/MiniChart";
import { DataValue } from "@/components/ui/DataValue";
import { Target, Shield, Activity, TrendingDown, Clock } from "lucide-react";

const instruments = [
  { symbol: "XAUUSD", price: "2,034.50", trend: "Overextended", probability: 78, status: "watching" },
  { symbol: "EURUSD", price: "1.0892", trend: "Balanced", probability: 45, status: "active" },
  { symbol: "NAS100", price: "17,834", trend: "Oversold", probability: 82, status: "preparing" },
  { symbol: "AAPL", price: "189.45", trend: "Overbought", probability: 71, status: "watching" },
  { symbol: "GBPUSD", price: "1.2734", trend: "Balanced", probability: 38, status: "cooling" },
];

const patterns = [
  { instrument: "XAUUSD", timeframe: "H4", type: "Bearish Engulfing", strength: 85 },
  { instrument: "EURUSD", timeframe: "H1", type: "Bullish Engulfing", strength: 72 },
  { instrument: "NAS100", timeframe: "M15", type: "Hammer", strength: 68 },
  { instrument: "GBPUSD", timeframe: "H4", type: "Doji", strength: 54 },
];

const trades: Trade[] = [
  { id: "1", time: "14:32", instrument: "XAUUSD", direction: "sell", entry: 2040.50, exit: 2028.00, size: "0.50", pnl: 625, rMultiple: 2.5 },
  { id: "2", time: "11:15", instrument: "EURUSD", direction: "buy", entry: 1.0845, exit: 1.0892, size: "1.00", pnl: 470, rMultiple: 1.8 },
  { id: "3", time: "09:42", instrument: "NAS100", direction: "sell", entry: 17920, exit: 17780, size: "2", pnl: 1400, rMultiple: 3.2 },
  { id: "4", time: "Yesterday", instrument: "AAPL", direction: "buy", entry: 186.20, exit: 189.45, size: "50", pnl: 162.5, rMultiple: 1.4 },
  { id: "5", time: "Yesterday", instrument: "GBPUSD", direction: "sell", entry: 1.2780, exit: 1.2810, size: "0.75", pnl: -225, rMultiple: -1.0 },
];

export default function NuvexStrategy() {
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
              <h1 className="font-display text-4xl lg:text-5xl font-bold">Nuvex</h1>
              <p className="text-muted-foreground">Institutional Reversal Engine</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            How Nuvex hunts high-probability reversals in FX, gold, indices and stocks.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard>
            <DataValue label="Win Rate" value="78%" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Avg R:R" value="2.1" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Max DD" value="-4.2%" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Active Trades" value="3" size="sm" />
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
                <span className="font-mono font-bold">8</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <span className="text-sm">Max Correlated Exposure</span>
                <span className="font-mono font-bold">40%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <span className="text-sm">Daily Loss Limit</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-bullish rounded-full" style={{ width: "25%" }} />
                  </div>
                  <span className="font-mono text-sm">1.2% / 5%</span>
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
