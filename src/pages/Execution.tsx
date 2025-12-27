import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { OrderBook } from "@/components/ui/OrderBook";
import { MiniChart } from "@/components/ui/MiniChart";
import { DataValue } from "@/components/ui/DataValue";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Zap, ArrowRight, Clock, Target, Shield, Activity } from "lucide-react";

interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

interface ExecutionData {
  orderbook: {
    instrument: string;
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
    spread: number;
  };
  tradeTicket: {
    instrument: string;
    strategy: string;
    direction: string;
    entry: number;
    stopLoss: number;
    takeProfit: number;
    size: string;
    risk: string;
  };
  executionMetrics: {
    speed: string;
    slippage: string;
    fillQuality: string;
  };
  equityCurve: number[];
  exposure: {
    currentExposure: string;
    openPnL: string;
  };
}

export default function Execution() {
  const [data, setData] = useState<ExecutionData | null>(null);
  const equityCurveRef = useRef<number[]>([]);

  // Generate real-time dynamic execution data
  const generateExecutionData = (): ExecutionData => {
    const now = Date.now();
    const timeVariation = Math.sin(now / 10000) * 0.5; // Slow price variation
    
    // Base price for XAUUSD (Gold) - realistic range
    const basePrice = 2034.50;
    const priceVariation = (Math.random() - 0.5) * 2; // ±1 USD variation
    const currentPrice = basePrice + priceVariation + timeVariation;
    
    // Generate dynamic orderbook with realistic price levels
    const generateOrderBookLevels = (base: number, isBid: boolean): OrderBookLevel[] => {
      const levels: OrderBookLevel[] = [];
      let runningTotal = 0;
      for (let i = 0; i < 5; i++) {
        const priceOffset = isBid ? -i * 0.1 : i * 0.1;
        const price = currentPrice + priceOffset;
        const size = Math.random() * 300 + 50; // 50-350 lots
        runningTotal += size;
        levels.push({
          price: Math.round(price * 100) / 100,
          size: Math.round(size * 10) / 10,
          total: Math.round(runningTotal * 10) / 10,
        });
      }
      return levels;
    };

    const bids = generateOrderBookLevels(currentPrice, true).sort((a, b) => b.price - a.price);
    const asks = generateOrderBookLevels(currentPrice, false).sort((a, b) => a.price - b.price);
    const spread = Math.round((asks[0].price - bids[0].price) * 100) / 100;

    // Generate dynamic execution metrics
    const latency = Math.round((Math.random() * 15 + 8) * 10) / 10; // 8-23ms
    const slippagePips = Math.round((Math.random() * 0.5 + 0.1) * 10) / 10; // 0.1-0.6 pips
    const fillQualityOptions = ['Excellent', 'Good', 'Fair'];
    const fillQuality = fillQualityOptions[Math.floor(Math.random() * fillQualityOptions.length)];

    // Update equity curve (growing over time with realistic variation)
    if (equityCurveRef.current.length === 0) {
      // Generate initial curve
      const baseEquity = 100000;
      equityCurveRef.current = Array.from({ length: 30 }, (_, i) => {
        const variation = (Math.random() - 0.3) * 2000;
        const trend = i * 100;
        return Math.round(baseEquity + variation + trend);
      });
    } else {
      // Continue from existing curve
      const lastValue = equityCurveRef.current[equityCurveRef.current.length - 1];
      // Add new point with realistic growth/variation
      const growth = (Math.random() - 0.3) * 500; // Slight positive bias
      const newValue = Math.max(95000, lastValue + growth);
      equityCurveRef.current.push(Math.round(newValue));
      // Keep only last 50 points
      if (equityCurveRef.current.length > 50) {
        equityCurveRef.current = equityCurveRef.current.slice(-50);
      }
    }

    // Generate dynamic exposure data
    const currentExposure = Math.round((Math.random() * 20 + 25) * 10) / 10; // 25-45%
    const pnlVariation = (Math.random() - 0.4) * 5000; // Slight positive bias
    const openPnL = pnlVariation >= 0 
      ? `+$${Math.round(pnlVariation).toLocaleString()}` 
      : `-$${Math.abs(Math.round(pnlVariation)).toLocaleString()}`;

    // Generate trade ticket
    const strategies = ['Nuvex', 'Xylo', 'Drav', 'Yark', 'Tenzor', 'Omnix'];
    const directions = ['BUY', 'SELL'];
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    
    const stopLossDistance = currentPrice * 0.003; // ~0.3% stop loss
    const takeProfitDistance = currentPrice * 0.008; // ~0.8% take profit
    
    const tradeTicket = {
      instrument: 'XAUUSD',
      strategy: strategy,
      direction: direction,
      entry: Math.round(currentPrice * 100) / 100,
      stopLoss: direction === 'BUY' 
        ? Math.round((currentPrice - stopLossDistance) * 100) / 100
        : Math.round((currentPrice + stopLossDistance) * 100) / 100,
      takeProfit: direction === 'BUY'
        ? Math.round((currentPrice + takeProfitDistance) * 100) / 100
        : Math.round((currentPrice - takeProfitDistance) * 100) / 100,
      size: `${(Math.random() * 0.5 + 0.25).toFixed(2)} lots`,
      risk: `${(Math.random() * 0.8 + 0.8).toFixed(1)}%`,
    };

    return {
      orderbook: {
        instrument: 'XAUUSD',
        bids,
        asks,
        spread,
      },
      tradeTicket,
      executionMetrics: {
        speed: `${latency}ms`,
        slippage: `${slippagePips} pips`,
        fillQuality,
      },
      equityCurve: [...equityCurveRef.current],
      exposure: {
        currentExposure: `${currentExposure}%`,
        openPnL,
      },
    };
  };

  // Initialize and update data in real-time
  useEffect(() => {
    // Generate initial data
    setData(generateExecutionData());

    // Update data every 2 seconds for real-time feel
    const interval = setInterval(() => {
      setData(generateExecutionData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Use generated data or fallback
  const orderbook = data?.orderbook || {
    instrument: "XAUUSD",
    bids: [],
    asks: [],
    spread: 0,
  };
  const tradeTicket = data?.tradeTicket || {
    instrument: "XAUUSD",
    strategy: "Nuvex",
    direction: "BUY",
    entry: 2034.50,
    stopLoss: 2028.00,
    takeProfit: 2052.00,
    size: "0.50 lots",
    risk: "1.2%",
  };
  const executionMetrics = data?.executionMetrics || {
    speed: "12ms",
    slippage: "0.3 pips",
    fillQuality: "Excellent",
  };
  const equityData = data?.equityCurve || Array.from({ length: 30 }, (_, i) => 100000 + Math.sin(i / 5) * 2000 + i * 150);
  const exposure = data?.exposure || {
    currentExposure: "34.5%",
    openPnL: "+$2,340",
  };
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
              <span className="text-sm font-mono text-primary">{orderbook.instrument}</span>
            </div>
            <OrderBook 
              bids={orderbook.bids}
              asks={orderbook.asks}
              spread={orderbook.spread}
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
                <StatusBadge sentiment={tradeTicket.direction === "BUY" ? "bullish" : "bearish"} text={tradeTicket.direction} />
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
                  <p className="text-sm font-mono font-medium">{exposure.currentExposure}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Open P&L</p>
                  <p className={`text-sm font-mono font-medium ${exposure.openPnL.startsWith('+') ? 'text-bullish' : exposure.openPnL.startsWith('-') ? 'text-bearish' : ''}`}>
                    {exposure.openPnL}
                  </p>
                </div>
              </div>
            </div>
          <MiniChart data={equityData} color="primary" height={120} />
        </GlassCard>
      </div>
    </Layout>
  );
}
