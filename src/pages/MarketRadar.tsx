import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { HeatmapGrid } from "@/components/ui/HeatmapGrid";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MiniChart } from "@/components/ui/MiniChart";
import { Radar, TrendingUp, Activity, AlertTriangle } from "lucide-react";

const assetClasses = [
  { label: "Forex", value: 72, sublabel: "Trending" },
  { label: "Indices", value: 58, sublabel: "Ranging" },
  { label: "Stocks", value: 45, sublabel: "Mixed" },
  { label: "Crypto", value: 85, sublabel: "High Vol" },
  { label: "Gold", value: 67, sublabel: "Trending" },
  { label: "Metals", value: 52, sublabel: "Stable" },
];

const opportunities = [
  { symbol: "XAUUSD", price: "2,034.50", change: 1.24, strategy: "Nuvex", signal: "Preparing Entry" },
  { symbol: "EURUSD", price: "1.0892", change: -0.34, strategy: "Yark", signal: "Watching" },
  { symbol: "BTCUSDT", price: "43,892", change: 2.45, strategy: "Xylo", signal: "In Position" },
  { symbol: "NAS100", price: "17,834", change: 0.87, strategy: "Tenzor", signal: "Watching" },
  { symbol: "AAPL", price: "189.45", change: -0.56, strategy: "Tenzor", signal: "Preparing Entry" },
  { symbol: "TSLA", price: "245.30", change: 3.21, strategy: "Drav", signal: "In Position" },
  { symbol: "GBPUSD", price: "1.2734", change: -0.08, strategy: "Nuvex", signal: "Watching" },
  { symbol: "ETHUSDT", price: "2,345.80", change: 1.87, strategy: "Xylo", signal: "Preparing Entry" },
];

const regimes = [
  { name: "High Volatility Regime", description: "VIX elevated, wider stops recommended" },
  { name: "Trending Crypto Regime", description: "Strong momentum in majors, breakout plays active" },
  { name: "Risk-Off Equities", description: "Defensive positioning, reduced exposure" },
];

export default function MarketRadar() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Radar className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Multi-Asset <span className="text-primary text-glow">Radar</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            How Algofi scans the entire market before placing any trade.
          </p>
        </div>

        {/* Asset Class Heatmap */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl">Asset Class Heatmap</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span>Live scan</span>
            </div>
          </div>
          <HeatmapGrid cells={assetClasses} columns={3} />
        </GlassCard>

        {/* Top Opportunities */}
        <GlassCard>
          <h3 className="font-display font-bold text-xl mb-6">Top Opportunities</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Symbol</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Price</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">24h</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Trend</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Strategy</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Signal</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) => (
                  <tr key={opp.symbol} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-2 font-medium font-mono">{opp.symbol}</td>
                    <td className="py-4 px-2 font-mono text-muted-foreground">{opp.price}</td>
                    <td className="py-4 px-2">
                      <span className={opp.change >= 0 ? "text-bullish" : "text-bearish"}>
                        {opp.change >= 0 ? "+" : ""}{opp.change}%
                      </span>
                    </td>
                    <td className="py-4 px-2 w-24">
                      <MiniChart 
                        color={opp.change >= 0 ? "bullish" : "bearish"} 
                        height={24}
                      />
                    </td>
                    <td className="py-4 px-2 text-sm text-muted-foreground">{opp.strategy}</td>
                    <td className="py-4 px-2">
                      <StatusBadge 
                        status={
                          opp.signal === "In Position" ? "active" : 
                          opp.signal === "Preparing Entry" ? "preparing" : "watching"
                        }
                        text={opp.signal}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Regime Detection */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-neutral" />
            <h3 className="font-display font-bold text-xl">Regime Detection</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {regimes.map((regime, i) => (
              <div 
                key={i} 
                className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">{regime.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{regime.description}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
}
