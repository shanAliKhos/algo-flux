import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataValue } from "@/components/ui/DataValue";
import { MiniChart } from "@/components/ui/MiniChart";
import { TradeTable, Trade } from "@/components/ui/TradeTable";
import { PieChart, Activity, Layers, TrendingUp, AlertTriangle } from "lucide-react";

const factors = [
  { name: "Trend", weight: 28, active: true },
  { name: "Mean Reversion", weight: 22, active: true },
  { name: "Volatility", weight: 18, active: true },
  { name: "Liquidity", weight: 15, active: true },
  { name: "Regime", weight: 17, active: true },
];

const portfolioExposure = [
  { category: "Forex", value: 25, color: "bg-blue-500" },
  { category: "Indices", value: 20, color: "bg-green-500" },
  { category: "Stocks", value: 18, color: "bg-purple-500" },
  { category: "Crypto", value: 22, color: "bg-orange-500" },
  { category: "Gold", value: 15, color: "bg-yellow-500" },
];

const scenarios = [
  { 
    trigger: "Volatility spikes +50%", 
    exposure: "-15%",
    action: "Reduce position sizes, tighten stops"
  },
  { 
    trigger: "Equities drop 3%", 
    exposure: "-20%",
    action: "Hedge with VIX, reduce long equity"
  },
  { 
    trigger: "Dollar strengthens 2%", 
    exposure: "+5%",
    action: "Increase USD pairs, reduce EM exposure"
  },
];

const trades: Trade[] = [
  { id: "1", time: "Today", instrument: "Multi-Asset Rebalance", strategy: "Omnix", direction: "buy", entry: 0, size: "Portfolio", pnl: 4250 },
  { id: "2", time: "Yesterday", instrument: "Risk-Off Hedge", strategy: "Omnix", direction: "sell", entry: 0, size: "5% Hedge", pnl: 1820 },
  { id: "3", time: "2d ago", instrument: "Crypto Rotation", strategy: "Omnix", direction: "buy", entry: 0, size: "Sector", pnl: 3420 },
];

export default function OmnixStrategy() {
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);

  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-green-400 flex items-center justify-center">
              <PieChart className="w-8 h-8 text-background" />
            </div>
            <div className="text-left">
              <h1 className="font-display text-4xl lg:text-5xl font-bold">Omnix</h1>
              <p className="text-muted-foreground">Multi-Factor Hedge Fund Brain</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bringing all signals together for balanced portfolio decisions.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard>
            <DataValue label="Sharpe Ratio" value="2.8" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Max DD" value="-3.2%" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Active Factors" value="5" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Monthly Return" value="+8.4%" size="sm" change={8.4} />
          </GlassCard>
        </div>

        {/* Factor Dashboard */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl">Factor Dashboard</h3>
          </div>
          <div className="space-y-4">
            {factors.map((factor) => (
              <div key={factor.name} className="flex items-center gap-4">
                <span className="w-32 text-sm font-medium">{factor.name}</span>
                <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(factor.weight / totalWeight) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right font-mono">{factor.weight}%</span>
                <span className={`w-16 text-right text-xs ${factor.active ? "text-bullish" : "text-muted-foreground"}`}>
                  {factor.active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Portfolio Snapshot */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">Portfolio Snapshot</h3>
            </div>
            <div className="flex gap-6">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {portfolioExposure.reduce((acc, item, i) => {
                    const previousTotal = portfolioExposure.slice(0, i).reduce((s, p) => s + p.value, 0);
                    const strokeDasharray = `${item.value * 2.83} ${283 - item.value * 2.83}`;
                    const strokeDashoffset = -previousTotal * 2.83;
                    acc.push(
                      <circle
                        key={item.category}
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={`hsl(var(--primary))`}
                        strokeWidth="10"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="opacity-70"
                        style={{ filter: `hue-rotate(${i * 60}deg)` }}
                      />
                    );
                    return acc;
                  }, [] as JSX.Element[])}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-xs text-muted-foreground">Allocated</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {portfolioExposure.map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm">{item.category}</span>
                    </div>
                    <span className="font-mono">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Scenario Testing */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-neutral" />
              <h3 className="font-display font-bold text-xl">Scenario Testing</h3>
            </div>
            <div className="space-y-3">
              {scenarios.map((scenario, i) => (
                <div key={i} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{scenario.trigger}</span>
                    <span className={`font-mono font-bold ${
                      scenario.exposure.startsWith("-") ? "text-bearish" : "text-bullish"
                    }`}>
                      {scenario.exposure}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{scenario.action}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Equity Curve */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl">Portfolio Equity</h3>
          </div>
          <MiniChart height={150} color="primary" />
        </GlassCard>

        {/* Trade Journal */}
        <GlassCard>
          <h3 className="font-display font-bold text-xl mb-6">Omnix Trade Journal</h3>
          <TradeTable trades={trades} showStrategy />
        </GlassCard>
      </div>
    </Layout>
  );
}
