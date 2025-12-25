import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataValue } from "@/components/ui/DataValue";
import { MiniChart } from "@/components/ui/MiniChart";
import { Briefcase, TrendingUp, TrendingDown, PieChart, Shield, Globe } from "lucide-react";

const equityData = Array.from({ length: 60 }, (_, i) => 100000 + Math.sin(i / 8) * 3000 + i * 200);
const drawdownData = Array.from({ length: 60 }, (_, i) => Math.max(0, -Math.sin(i / 10) * 4));

const exposureTiles = [
  { category: "Forex", allocation: 28, pnl: 4250 },
  { category: "Indices", allocation: 22, pnl: 3120 },
  { category: "Stocks", allocation: 20, pnl: 1890 },
  { category: "Crypto", allocation: 18, pnl: 5420 },
  { category: "Gold", allocation: 12, pnl: 2340 },
];

const regionExposure = [
  { region: "US", allocation: 55 },
  { region: "Europe", allocation: 25 },
  { region: "Asia", allocation: 15 },
  { region: "EM", allocation: 5 },
];

const riskBuckets = [
  { name: "Conservative", allocation: 40, strategies: ["Yark", "Xylo"] },
  { name: "Balanced", allocation: 35, strategies: ["Nuvex", "Omnix"] },
  { name: "Aggressive", allocation: 25, strategies: ["Drav", "Tenzor"] },
];

export default function Portfolio() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Briefcase className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Hedge Fund <span className="text-primary text-glow">View</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            How all strategies work together as one fund.
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard glow>
            <DataValue label="Total Equity" value="$247,892" size="md" change={2.4} />
          </GlassCard>
          <GlassCard>
            <DataValue label="MTD Return" value="+8.4%" size="md" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Max Drawdown" value="-3.2%" size="md" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Sharpe Ratio" value="2.8" size="md" />
          </GlassCard>
        </div>

        {/* Equity Curve */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">Total Portfolio Equity</h3>
            </div>
            <div className="flex gap-2">
              {["1M", "3M", "6M"].map((period) => (
                <button
                  key={period}
                  className="px-3 py-1 text-xs rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <MiniChart data={equityData} height={180} color="primary" />
        </GlassCard>

        {/* Drawdown Strip */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <TrendingDown className="w-5 h-5 text-bearish" />
            <h3 className="font-display font-bold text-xl">Drawdown Strip</h3>
          </div>
          <div className="relative h-24">
            <MiniChart data={drawdownData} height={80} color="bearish" />
            <div className="absolute top-0 left-[30%] w-[15%] h-full bg-bearish/10 border-l border-r border-bearish/30 flex items-center justify-center">
              <span className="text-xs text-bearish">-3.2% Max</span>
            </div>
          </div>
        </GlassCard>

        {/* Exposure Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* By Asset Class */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">By Asset Class</h3>
            </div>
            <div className="space-y-3">
              {exposureTiles.map((item) => (
                <div key={item.category} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full" style={{ opacity: item.allocation / 30 }} />
                    <div>
                      <span className="font-medium">{item.category}</span>
                      <p className="text-xs text-muted-foreground">{item.allocation}% allocated</p>
                    </div>
                  </div>
                  <span className="font-mono text-bullish">+${item.pnl.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* By Region */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">By Region</h3>
            </div>
            <div className="space-y-4">
              {regionExposure.map((item) => (
                <div key={item.region}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.region}</span>
                    <span className="font-mono">{item.allocation}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${item.allocation}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Risk Buckets */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl">Risk Buckets</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {riskBuckets.map((bucket) => (
              <div 
                key={bucket.name}
                className={`p-6 rounded-xl border ${
                  bucket.name === "Conservative" ? "bg-bullish/10 border-bullish/20" :
                  bucket.name === "Balanced" ? "bg-neutral/10 border-neutral/20" :
                  "bg-bearish/10 border-bearish/20"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-display font-bold">{bucket.name}</h4>
                  <span className="text-2xl font-bold">{bucket.allocation}%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Strategies: {bucket.strategies.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
}
