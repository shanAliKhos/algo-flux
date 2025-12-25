import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { MiniChart } from "@/components/ui/MiniChart";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlayCircle, ArrowRight, Clock, DollarSign, Target, TrendingUp } from "lucide-react";

const replayTrades = [
  { id: 1, instrument: "XAUUSD", strategy: "Nuvex", structure: "Reversal" },
  { id: 2, instrument: "BTCUSDT", strategy: "Xylo", structure: "Mean-Reversion" },
  { id: 3, instrument: "NAS100", strategy: "Tenzor", structure: "Breakout" },
  { id: 4, instrument: "EURUSD", strategy: "Yark", structure: "Statistical" },
];

const tradeStory = {
  instrument: "XAUUSD",
  strategy: "Nuvex",
  entryTime: "2024-01-15 14:32:15",
  exitTime: "2024-01-15 16:45:22",
  holdingTime: "2h 13m",
  entryReason: "Bearish engulfing pattern at resistance with RSI divergence. Price rejected 2040 zone twice.",
  exitReason: "Take profit hit at 1:3 R:R. Price reached demand zone support.",
  structure: "Reversal",
  pnl: 2850,
  riskReward: "1:3.2",
  moveCapture: "78%",
};

const manualComparison = {
  manual: "Likely waited for confirmation, missed optimal entry, smaller position due to uncertainty.",
  algofi: "Entered immediately on pattern completion, optimal sizing, exited at pre-planned target.",
};

export default function TradeReplay() {
  const [selectedTrade, setSelectedTrade] = useState(replayTrades[0]);

  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <PlayCircle className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Trade <span className="text-primary text-glow">Replay</span> Theatre
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch Algofi trade like a professional desk. From Signal to Exit.
          </p>
        </div>

        {/* Trade Selection */}
        <div className="flex gap-3 flex-wrap">
          {replayTrades.map((trade) => (
            <button
              key={trade.id}
              onClick={() => setSelectedTrade(trade)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedTrade.id === trade.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span className="font-mono">{trade.instrument}</span>
              <span className="text-xs text-muted-foreground ml-2">{trade.strategy}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Replay Chart */}
          <div className="lg:col-span-2">
            <GlassCard glow className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl">Replay Chart</h3>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-primary">{selectedTrade.instrument}</span>
                  <StatusBadge text={selectedTrade.strategy} />
                </div>
              </div>
              <div className="relative h-[300px] bg-muted/30 rounded-lg border border-border overflow-hidden">
                <MiniChart height={300} color="primary" />
                {/* Entry/Exit markers */}
                <div className="absolute left-[20%] top-[60%] flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-bullish animate-pulse" />
                  <div className="w-0.5 h-8 bg-bullish/50" />
                  <span className="text-xs font-mono text-bullish mt-1">ENTRY</span>
                </div>
                <div className="absolute left-[75%] top-[30%] flex flex-col items-center">
                  <span className="text-xs font-mono text-neutral mb-1">EXIT</span>
                  <div className="w-0.5 h-8 bg-neutral/50" />
                  <div className="w-4 h-4 rounded-full bg-neutral animate-pulse" />
                </div>
                {/* Stop Loss line */}
                <div className="absolute left-0 right-0 top-[75%] border-t border-dashed border-bearish/50">
                  <span className="absolute right-2 -top-4 text-xs font-mono text-bearish">SL</span>
                </div>
                {/* Take Profit line */}
                <div className="absolute left-0 right-0 top-[25%] border-t border-dashed border-bullish/50">
                  <span className="absolute right-2 -top-4 text-xs font-mono text-bullish">TP</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Trade Story */}
          <GlassCard>
            <h3 className="font-display font-bold text-xl mb-6">AI Trade Story</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg">{tradeStory.instrument}</span>
                <StatusBadge text={tradeStory.strategy} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Entry</p>
                  <p className="font-mono">{tradeStory.entryTime.split(" ")[1]}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Exit</p>
                  <p className="font-mono">{tradeStory.exitTime.split(" ")[1]}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Holding: {tradeStory.holdingTime}</span>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Entry Reason</p>
                <p className="text-sm">{tradeStory.entryReason}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Exit Reason</p>
                <p className="text-sm">{tradeStory.exitReason}</p>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <StatusBadge text={tradeStory.structure} />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* P&L Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground uppercase">Move Captured</span>
            </div>
            <p className="text-4xl font-display font-bold text-primary">{tradeStory.moveCapture}</p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <ArrowRight className="w-5 h-5 text-bullish" />
              <span className="text-sm font-medium text-muted-foreground uppercase">Risk:Reward</span>
            </div>
            <p className="text-4xl font-display font-bold">{tradeStory.riskReward}</p>
          </GlassCard>

          <GlassCard glow>
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-5 h-5 text-bullish" />
              <span className="text-sm font-medium text-muted-foreground uppercase">Profit</span>
            </div>
            <p className="text-4xl font-display font-bold text-bullish">+${tradeStory.pnl.toLocaleString()}</p>
          </GlassCard>
        </div>

        {/* Comparison */}
        <GlassCard>
          <h3 className="font-display font-bold text-xl mb-6">Manual vs Algofi</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground uppercase mb-2">Manual Trader</p>
              <p className="text-sm">{manualComparison.manual}</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs text-primary uppercase mb-2">Algofi AI</p>
              <p className="text-sm">{manualComparison.algofi}</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
}
