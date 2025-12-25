import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TradeTable, Trade } from "@/components/ui/TradeTable";
import { DataValue } from "@/components/ui/DataValue";
import { TrendingUp, Target, Droplets, Shield, Activity } from "lucide-react";

const liquidityZones = [
  { instrument: "XAUUSD", type: "Equal Highs", level: "2045.50", strength: 92, status: "watching" },
  { instrument: "NAS100", type: "Equal Lows", level: "17650", strength: 85, status: "preparing" },
  { instrument: "US30", type: "Liquidity Pool", level: "38420", strength: 78, status: "active" },
  { instrument: "EURUSD", type: "Stop Hunt Zone", level: "1.0920", strength: 88, status: "watching" },
];

const smcZones = [
  { instrument: "XAUUSD", type: "Supply Zone", range: "2042-2048", strength: 89, planning: true },
  { instrument: "NAS100", type: "Demand Zone", range: "17580-17620", strength: 76, planning: true },
  { instrument: "US30", type: "Supply Zone", range: "38500-38600", strength: 82, planning: false },
  { instrument: "EURUSD", type: "Demand Zone", range: "1.0850-1.0865", strength: 71, planning: false },
];

const trades: Trade[] = [
  { id: "1", time: "13:45", instrument: "XAUUSD", direction: "sell", entry: 2046.20, exit: 2032.50, size: "0.75", pnl: 1027.50, rMultiple: 3.8 },
  { id: "2", time: "10:22", instrument: "NAS100", direction: "buy", entry: 17612, exit: 17780, size: "3", pnl: 2520, rMultiple: 2.4 },
  { id: "3", time: "Yesterday", instrument: "US30", direction: "sell", entry: 38580, exit: 38320, size: "2", pnl: 2600, rMultiple: 4.2 },
  { id: "4", time: "Yesterday", instrument: "EURUSD", direction: "buy", entry: 1.0852, exit: 1.0812, size: "1.50", pnl: -600, rMultiple: -1.0 },
];

export default function DravStrategy() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-background" />
            </div>
            <div className="text-left">
              <h1 className="font-display text-4xl lg:text-5xl font-bold">Drav</h1>
              <p className="text-muted-foreground">Smart Money AI</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reading liquidity, SMC zones, and institutional footprints.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard>
            <DataValue label="Win Rate" value="71%" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Avg R:R" value="3.2" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Liquidity Sweeps" value="24" size="sm" />
          </GlassCard>
          <GlassCard>
            <DataValue label="Active Zones" value="8" size="sm" />
          </GlassCard>
        </div>

        {/* Liquidity Map */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <Droplets className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl">Liquidity Map</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Symbol</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Type</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Level</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Strength</th>
                  <th className="py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {liquidityZones.map((zone, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-4 px-2 font-mono font-medium">{zone.instrument}</td>
                    <td className="py-4 px-2 text-sm">{zone.type}</td>
                    <td className="py-4 px-2 font-mono text-primary">{zone.level}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${zone.strength}%` }} />
                        </div>
                        <span className="text-sm font-mono">{zone.strength}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <StatusBadge status={zone.status as any} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* SMC Zone Dashboard */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">SMC Zone Dashboard</h3>
            </div>
            <div className="space-y-3">
              {smcZones.map((zone, i) => (
                <div key={i} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{zone.instrument}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        zone.type === "Supply Zone" 
                          ? "bg-bearish/20 text-bearish" 
                          : "bg-bullish/20 text-bullish"
                      }`}>
                        {zone.type}
                      </span>
                    </div>
                    {zone.planning && (
                      <span className="text-xs text-primary animate-pulse">Planning Entry</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-muted-foreground">{zone.range}</span>
                    <span className="text-muted-foreground">Strength: {zone.strength}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Narrative Box */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">Smart Money Interpretation</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-primary" />
                  Liquidity Sweeps
                </h4>
                <p className="text-sm text-muted-foreground">
                  Price deliberately moves to take out clusters of stop losses before reversing. 
                  Drav identifies these areas where retail stops accumulate.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Inducements</h4>
                <p className="text-sm text-muted-foreground">
                  False breakouts designed to trap traders. Drav waits for confirmation 
                  before entering against the induced direction.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">BOS / CHOCH</h4>
                <p className="text-sm text-muted-foreground">
                  Break of Structure and Change of Character signals mark the shift 
                  in market direction. Key entry confirmations.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Trade History */}
        <GlassCard>
          <h3 className="font-display font-bold text-xl mb-6">Trade History</h3>
          <TradeTable trades={trades} showStrategy={false} />
        </GlassCard>
      </div>
    </Layout>
  );
}
