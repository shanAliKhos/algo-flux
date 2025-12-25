import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { TradeTable, Trade } from "@/components/ui/TradeTable";
import { DataValue } from "@/components/ui/DataValue";
import { Shield, Activity, Download, BarChart3, Clock, Zap } from "lucide-react";

const recentTrades: Trade[] = [
  { id: "1", time: "14:32:15", instrument: "XAUUSD", strategy: "Nuvex", direction: "sell", entry: 2040.50, size: "0.50", status: "Filled" },
  { id: "2", time: "14:28:42", instrument: "BTCUSDT", strategy: "Xylo", direction: "buy", entry: 43850, size: "0.15", status: "Filled" },
  { id: "3", time: "14:15:33", instrument: "NAS100", strategy: "Tenzor", direction: "buy", entry: 17812, size: "2.0", status: "Filled" },
  { id: "4", time: "13:58:21", instrument: "EURUSD", strategy: "Yark", direction: "sell", entry: 1.0895, size: "1.00", status: "Filled" },
  { id: "5", time: "13:42:08", instrument: "TSLA", strategy: "Tenzor", direction: "buy", entry: 242.50, size: "50", status: "Filled" },
  { id: "6", time: "13:28:55", instrument: "XAUUSD", strategy: "Drav", direction: "buy", entry: 2032.20, size: "0.75", status: "Closed" },
];

const strategyPerformance = [
  { name: "Nuvex", trades: 124, winRate: 78, avgR: 2.1, pnl: 18420 },
  { name: "Xylo", trades: 1247, winRate: 82, avgR: 0.8, pnl: 24580 },
  { name: "Drav", trades: 89, winRate: 71, avgR: 3.2, pnl: 15240 },
  { name: "Yark", trades: 156, winRate: 85, avgR: 1.8, pnl: 21890 },
  { name: "Tenzor", trades: 78, winRate: 76, avgR: 2.8, pnl: 19670 },
  { name: "Omnix", trades: 42, winRate: 89, avgR: 2.4, pnl: 28450 },
];

const topInstruments = [
  { symbol: "XAUUSD", trades: 245, volume: "$2.4M", pnl: 28420 },
  { symbol: "BTCUSDT", trades: 312, volume: "$1.8M", pnl: 24580 },
  { symbol: "NAS100", trades: 189, volume: "$1.2M", pnl: 18920 },
  { symbol: "EURUSD", trades: 278, volume: "$3.2M", pnl: 15240 },
  { symbol: "TSLA", trades: 156, volume: "$890K", pnl: 12680 },
];

export default function Transparency() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Complete <span className="text-primary text-glow">Transparency</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Institutional standards. Full audit trail.
          </p>
        </div>

        {/* Compliance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard>
            <DataValue label="Max Leverage" value="10x" size="sm" />
            <p className="text-xs text-muted-foreground mt-2">Current: 4.2x</p>
          </GlassCard>
          <GlassCard>
            <DataValue label="Max Drawdown" value="15%" size="sm" />
            <p className="text-xs text-muted-foreground mt-2">Observed: 3.2%</p>
          </GlassCard>
          <GlassCard>
            <DataValue label="Avg Slippage" value="0.12 pips" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Fill Rate" value="99.8%" size="sm" />
          </GlassCard>
        </div>

        {/* Real-Time Trade Log */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">Real-Time Trade Log</h3>
            </div>
            <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full animate-pulse">
              LIVE
            </span>
          </div>
          <TradeTable trades={recentTrades} showStrategy showStatus />
        </GlassCard>

        {/* Performance Tables */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* By Strategy */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">By Strategy</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Strategy</th>
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Trades</th>
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Win %</th>
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Avg R</th>
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {strategyPerformance.map((strat) => (
                    <tr key={strat.name} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-2 font-medium">{strat.name}</td>
                      <td className="py-3 px-2 font-mono text-muted-foreground">{strat.trades}</td>
                      <td className="py-3 px-2 font-mono">{strat.winRate}%</td>
                      <td className="py-3 px-2 font-mono">{strat.avgR}</td>
                      <td className="py-3 px-2 font-mono text-bullish">+${strat.pnl.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* By Instrument */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">Top Instruments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Symbol</th>
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Trades</th>
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Volume</th>
                    <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {topInstruments.map((inst) => (
                    <tr key={inst.symbol} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-2 font-mono font-medium">{inst.symbol}</td>
                      <td className="py-3 px-2 font-mono text-muted-foreground">{inst.trades}</td>
                      <td className="py-3 px-2 font-mono text-muted-foreground">{inst.volume}</td>
                      <td className="py-3 px-2 font-mono text-bullish">+${inst.pnl.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Risk & Compliance Panel */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl">Risk & Compliance</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase mb-2">Current Leverage</p>
              <p className="text-2xl font-display font-bold">4.2x</p>
              <p className="text-xs text-muted-foreground mt-1">Limit: 10x</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase mb-2">Current DD</p>
              <p className="text-2xl font-display font-bold text-bearish">-1.4%</p>
              <p className="text-xs text-muted-foreground mt-1">Max observed: -3.2%</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase mb-2">Slippage Stats</p>
              <p className="text-2xl font-display font-bold">0.12 pips</p>
              <p className="text-xs text-muted-foreground mt-1">Max: 0.8 pips</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase mb-2">Venues</p>
              <p className="text-2xl font-display font-bold">12</p>
              <p className="text-xs text-muted-foreground mt-1">Prime brokers: 3</p>
            </div>
          </div>
        </GlassCard>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/30 text-primary font-medium hover:bg-primary/10 transition-all">
            <Download className="w-4 h-4" />
            Export Trade Report
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/30 text-primary font-medium hover:bg-primary/10 transition-all">
            <Download className="w-4 h-4" />
            Export Strategy Stats
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/30 text-primary font-medium hover:bg-primary/10 transition-all">
            <Clock className="w-4 h-4" />
            Audit Trail
          </button>
        </div>
      </div>
    </Layout>
  );
}
