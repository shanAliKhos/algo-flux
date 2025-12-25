import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { OrderBook } from "@/components/ui/OrderBook";
import { MiniChart } from "@/components/ui/MiniChart";
import { DataValue } from "@/components/ui/DataValue";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Zap, ArrowRight, Clock, Target, Shield, Activity } from "lucide-react";

const tradeTicket = {
  instrument: "XAUUSD",
  strategy: "Nuvex",
  direction: "BUY",
  entry: 2034.50,
  stopLoss: 2028.00,
  takeProfit: 2052.00,
  size: "0.50 lots",
  risk: "1.2%",
};

const executionMetrics = {
  speed: "12ms",
  slippage: "0.3 pips",
  fillQuality: "Excellent",
};

const equityData = Array.from({ length: 30 }, (_, i) => 100000 + Math.sin(i / 5) * 2000 + i * 150);

export default function Execution() {
  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Zap className="w-10 h-10 text-primary" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Precision <span className="text-primary text-glow">Execution</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From signal to fill with hedge fund discipline. Zero emotion.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Orderbook */}
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-xl">Orderbook & Liquidity</h3>
              <span className="text-sm font-mono text-primary">XAUUSD</span>
            </div>
            <OrderBook 
              bids={[
                { price: 2034.50, size: 125.4, total: 125.4 },
                { price: 2034.40, size: 89.2, total: 214.6 },
                { price: 2034.30, size: 234.8, total: 449.4 },
                { price: 2034.20, size: 156.3, total: 605.7 },
                { price: 2034.10, size: 312.5, total: 918.2 },
              ]}
              asks={[
                { price: 2034.60, size: 98.7, total: 98.7 },
                { price: 2034.70, size: 145.3, total: 244.0 },
                { price: 2034.80, size: 267.9, total: 511.9 },
                { price: 2034.90, size: 189.4, total: 701.3 },
                { price: 2035.00, size: 421.2, total: 1122.5 },
              ]}
              spread={0.10}
            />
          </GlassCard>

          {/* Trade Ticket */}
          <GlassCard glow>
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-xl">AI Trade Ticket</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Instrument</p>
                  <p className="text-xl font-display font-bold">{tradeTicket.instrument}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase">Strategy</p>
                  <p className="text-lg font-medium">{tradeTicket.strategy}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <StatusBadge sentiment="bullish" text={tradeTicket.direction} />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono font-bold text-lg">{tradeTicket.entry}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-bearish/10 rounded-lg border border-bearish/20">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Stop Loss</p>
                  <p className="font-mono font-bold text-bearish">{tradeTicket.stopLoss}</p>
                </div>
                <div className="p-3 bg-bullish/10 rounded-lg border border-bullish/20">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Take Profit</p>
                  <p className="font-mono font-bold text-bullish">{tradeTicket.takeProfit}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Position Size</p>
                  <p className="font-mono font-medium">{tradeTicket.size}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Risk Level</p>
                  <p className="font-mono font-medium text-neutral">{tradeTicket.risk}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Latency & Fill Quality */}
        <div className="grid md:grid-cols-3 gap-6">
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground uppercase">Execution Speed</span>
            </div>
            <DataValue label="Latency" value={executionMetrics.speed} size="lg" />
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-neutral" />
              <span className="text-sm font-medium text-muted-foreground uppercase">Slippage</span>
            </div>
            <DataValue label="Average" value={executionMetrics.slippage} size="lg" />
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-bullish" />
              <span className="text-sm font-medium text-muted-foreground uppercase">Fill Quality</span>
            </div>
            <StatusBadge status="active" text={executionMetrics.fillQuality} />
          </GlassCard>
        </div>

        {/* Live Equity Strip */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl">Live Equity Curve</h3>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Current Exposure</p>
                <p className="text-sm font-mono font-medium">34.5%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Open P&L</p>
                <p className="text-sm font-mono font-medium text-bullish">+$2,340</p>
              </div>
            </div>
          </div>
          <MiniChart data={equityData} color="primary" height={120} />
        </GlassCard>
      </div>
    </Layout>
  );
}
