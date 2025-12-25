import { cn } from "@/lib/utils";

interface OrderLevel {
  price: number;
  size: number;
  total: number;
}

interface OrderBookProps {
  bids: OrderLevel[];
  asks: OrderLevel[];
  spread: number;
}

const defaultBids: OrderLevel[] = [
  { price: 2034.50, size: 125.4, total: 125.4 },
  { price: 2034.40, size: 89.2, total: 214.6 },
  { price: 2034.30, size: 234.8, total: 449.4 },
  { price: 2034.20, size: 156.3, total: 605.7 },
  { price: 2034.10, size: 312.5, total: 918.2 },
];

const defaultAsks: OrderLevel[] = [
  { price: 2034.60, size: 98.7, total: 98.7 },
  { price: 2034.70, size: 145.3, total: 244.0 },
  { price: 2034.80, size: 267.9, total: 511.9 },
  { price: 2034.90, size: 189.4, total: 701.3 },
  { price: 2035.00, size: 421.2, total: 1122.5 },
];

export function OrderBook({
  bids = defaultBids,
  asks = defaultAsks,
  spread = 0.10,
}: OrderBookProps) {
  const maxTotal = Math.max(
    ...bids.map((b) => b.total),
    ...asks.map((a) => a.total)
  );

  return (
    <div className="space-y-4">
      {/* Asks (reversed to show highest at top) */}
      <div className="space-y-1">
        {[...asks].reverse().map((level, i) => (
          <div key={`ask-${i}`} className="relative flex items-center text-xs font-mono">
            <div
              className="absolute right-0 top-0 bottom-0 bg-bearish/10"
              style={{ width: `${(level.total / maxTotal) * 100}%` }}
            />
            <span className="relative z-10 w-24 text-bearish">{level.price.toFixed(2)}</span>
            <span className="relative z-10 flex-1 text-right text-muted-foreground">
              {level.size.toFixed(1)}
            </span>
            <span className="relative z-10 w-24 text-right text-muted-foreground">
              {level.total.toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="py-2 border-y border-border text-center">
        <span className="text-xs text-muted-foreground">Spread: </span>
        <span className="text-sm font-mono font-medium text-foreground">
          {spread.toFixed(2)} ({((spread / bids[0]?.price) * 100).toFixed(3)}%)
        </span>
      </div>

      {/* Bids */}
      <div className="space-y-1">
        {bids.map((level, i) => (
          <div key={`bid-${i}`} className="relative flex items-center text-xs font-mono">
            <div
              className="absolute left-0 top-0 bottom-0 bg-bullish/10"
              style={{ width: `${(level.total / maxTotal) * 100}%` }}
            />
            <span className="relative z-10 w-24 text-bullish">{level.price.toFixed(2)}</span>
            <span className="relative z-10 flex-1 text-right text-muted-foreground">
              {level.size.toFixed(1)}
            </span>
            <span className="relative z-10 w-24 text-right text-muted-foreground">
              {level.total.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
