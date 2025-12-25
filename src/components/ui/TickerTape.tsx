import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TickerItem {
  symbol: string;
  price: string;
  change: number;
}

const defaultTickers: TickerItem[] = [
  { symbol: "EURUSD", price: "1.0892", change: 0.12 },
  { symbol: "XAUUSD", price: "2,034.50", change: -0.34 },
  { symbol: "NAS100", price: "17,834.20", change: 1.24 },
  { symbol: "BTCUSD", price: "43,892.00", change: 2.45 },
  { symbol: "ETHUSD", price: "2,345.80", change: 1.87 },
  { symbol: "AAPL", price: "189.45", change: -0.56 },
  { symbol: "TSLA", price: "245.30", change: 3.21 },
  { symbol: "GBPUSD", price: "1.2734", change: -0.08 },
];

export function TickerTape({ tickers = defaultTickers }: { tickers?: TickerItem[] }) {
  const duplicated = [...tickers, ...tickers];

  return (
    <div className="w-full overflow-hidden glass py-3">
      <div className="flex animate-ticker">
        {duplicated.map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-6 px-6 border-r border-border/50 whitespace-nowrap"
          >
            <span className="font-mono font-medium text-foreground">{item.symbol}</span>
            <span className="font-mono text-muted-foreground">{item.price}</span>
            <span
              className={cn(
                "flex items-center gap-1 font-mono text-sm",
                item.change > 0 ? "text-bullish" : "text-bearish"
              )}
            >
              {item.change > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {item.change > 0 ? "+" : ""}
              {item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
